<?php

declare(strict_types=1);

function crypto_table_config(): array
{
    static $config;

    if ($config !== null) {
        return $config;
    }

    $supportedCurrencies = ['usd' => '$', 'inr' => '₹', 'eur' => '€', 'gbp' => '£'];
    $defaultCurrency = strtolower((string) getenv('CRYPTO_TABLE_DEFAULT_CURRENCY')) ?: 'usd';
    $defaultCurrency = array_key_exists($defaultCurrency, $supportedCurrencies) ? $defaultCurrency : 'usd';

    $cacheTtl = (int) (getenv('CRYPTO_TABLE_CACHE_TTL') ?: 300);
    $assetLimit = (int) (getenv('CRYPTO_TABLE_ASSET_LIMIT') ?: 100);
    $assetLimit = max(25, min($assetLimit, 250));

    $config = [
        'provider_name' => 'CoinGecko',
        'provider_url' => 'https://api.coingecko.com/api/v3',
        'cache_dir' => dirname(__DIR__) . '/cache',
        'cache_ttl' => max($cacheTtl, 60),
        'asset_limit' => $assetLimit,
        'supported_currencies' => $supportedCurrencies,
        'default_currency' => $defaultCurrency,
        'request_timeout' => 20,
        'fallback_exchange_rates' => [
            'usd' => 1.0,
            'eur' => (float) (getenv('CRYPTO_TABLE_FALLBACK_EUR_RATE') ?: 0.92),
            'gbp' => (float) (getenv('CRYPTO_TABLE_FALLBACK_GBP_RATE') ?: 0.79),
            'inr' => (float) (getenv('CRYPTO_TABLE_FALLBACK_INR_RATE') ?: 83.0),
        ],
    ];

    if (!is_dir($config['cache_dir'])) {
        mkdir($config['cache_dir'], 0777, true);
    }

    return $config;
}

function crypto_table_supported_currencies(): array
{
    return crypto_table_config()['supported_currencies'];
}

function crypto_table_default_currency(): string
{
    return crypto_table_config()['default_currency'];
}

function crypto_table_normalize_currency(?string $currency): string
{
    $currency = strtolower(trim((string) $currency));
    if ($currency === '') {
        return crypto_table_default_currency();
    }

    $supportedCurrencies = crypto_table_supported_currencies();

    return array_key_exists($currency, $supportedCurrencies) ? $currency : crypto_table_default_currency();
}

function crypto_table_currency_symbol(string $currency): string
{
    $supportedCurrencies = crypto_table_supported_currencies();

    return $supportedCurrencies[$currency] ?? strtoupper($currency) . ' ';
}

function crypto_table_cache_file(string $currency): string
{
    $config = crypto_table_config();

    return $config['cache_dir'] . '/market-' . $currency . '.json';
}

function crypto_table_fetch_market_payload(string $currency, bool $forceRefresh = false): array
{
    $currency = crypto_table_normalize_currency($currency);
    $config = crypto_table_config();
    $cacheFile = crypto_table_cache_file($currency);
    $cachedPayload = crypto_table_read_cache($cacheFile);

    $isFresh = $cachedPayload !== null
        && isset($cachedPayload['meta']['fetched_at'])
        && (time() - strtotime((string) $cachedPayload['meta']['fetched_at'])) < $config['cache_ttl'];

    if (!$forceRefresh && $isFresh) {
        $cachedPayload['meta']['source_status'] = 'fresh-cache';
        $cachedPayload['meta']['stale'] = false;
        return $cachedPayload;
    }

    try {
        $payload = crypto_table_build_payload($currency, $config);
        file_put_contents($cacheFile, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        return $payload;
    } catch (Throwable $exception) {
        if ($cachedPayload !== null) {
            $cachedPayload['meta']['stale'] = true;
            $cachedPayload['meta']['source_status'] = 'stale-cache';
            $cachedPayload['meta']['warning'] = $exception->getMessage();
            return $cachedPayload;
        }

        $archivePayload = crypto_table_build_archive_payload($currency, $config, $exception->getMessage());
        if ($archivePayload !== null) {
            return $archivePayload;
        }

        throw $exception;
    }
}

function crypto_table_read_cache(string $cacheFile): ?array
{
    if (!is_file($cacheFile)) {
        return null;
    }

    $contents = file_get_contents($cacheFile);
    if ($contents === false || $contents === '') {
        return null;
    }

    $payload = json_decode($contents, true);

    return is_array($payload) ? $payload : null;
}

function crypto_table_build_payload(string $currency, array $config): array
{
    $marketsUrl = sprintf(
        '%s/coins/markets?vs_currency=%s&order=market_cap_desc&per_page=%d&page=1&sparkline=true&price_change_percentage=1h,24h,7d,30d',
        $config['provider_url'],
        rawurlencode($currency),
        $config['asset_limit']
    );

    $globalUrl = $config['provider_url'] . '/global';
    $markets = crypto_table_http_get_json($marketsUrl, $config['request_timeout']);
    $global = crypto_table_http_get_json($globalUrl, $config['request_timeout']);

    if (!is_array($markets)) {
        throw new RuntimeException('Market provider returned an unexpected response.');
    }

    $globalData = is_array($global) && isset($global['data']) && is_array($global['data']) ? $global['data'] : [];
    $fetchedAt = gmdate('c');
    $assets = array_map(static function (array $asset) use ($currency) {
        $sparkline = [];
        if (isset($asset['sparkline_in_7d']['price']) && is_array($asset['sparkline_in_7d']['price'])) {
            $sparkline = array_values(array_map('floatval', $asset['sparkline_in_7d']['price']));
        }

        return [
            'id' => (string) ($asset['id'] ?? ''),
            'rank' => (int) ($asset['market_cap_rank'] ?? 0),
            'name' => (string) ($asset['name'] ?? ''),
            'symbol' => strtoupper((string) ($asset['symbol'] ?? '')),
            'image' => (string) ($asset['image'] ?? ''),
            'price' => isset($asset['current_price']) ? (float) $asset['current_price'] : null,
            'market_cap' => isset($asset['market_cap']) ? (float) $asset['market_cap'] : null,
            'volume_24h' => isset($asset['total_volume']) ? (float) $asset['total_volume'] : null,
            'available_supply' => isset($asset['circulating_supply']) ? (float) $asset['circulating_supply'] : null,
            'total_supply' => isset($asset['total_supply']) ? (float) $asset['total_supply'] : null,
            'max_supply' => isset($asset['max_supply']) ? (float) $asset['max_supply'] : null,
            'percent_change_1h' => isset($asset['price_change_percentage_1h_in_currency']) ? (float) $asset['price_change_percentage_1h_in_currency'] : null,
            'percent_change_24h' => isset($asset['price_change_percentage_24h_in_currency']) ? (float) $asset['price_change_percentage_24h_in_currency'] : null,
            'percent_change_7d' => isset($asset['price_change_percentage_7d_in_currency']) ? (float) $asset['price_change_percentage_7d_in_currency'] : null,
            'percent_change_30d' => isset($asset['price_change_percentage_30d_in_currency']) ? (float) $asset['price_change_percentage_30d_in_currency'] : null,
            'sparkline' => $sparkline,
            'last_updated' => (string) ($asset['last_updated'] ?? ''),
            'details_url' => 'https://www.coingecko.com/en/coins/' . rawurlencode((string) ($asset['id'] ?? '')),
            'source_currency' => strtoupper($currency),
        ];
    }, $markets);

    return [
        'meta' => [
            'currency' => strtoupper($currency),
            'currency_symbol' => crypto_table_currency_symbol($currency),
            'supported_currencies' => array_map('strtoupper', array_keys($config['supported_currencies'])),
            'provider' => $config['provider_name'],
            'provider_url' => 'https://www.coingecko.com/',
            'fetched_at' => $fetchedAt,
            'source_status' => 'live',
            'stale' => false,
            'cache_ttl' => $config['cache_ttl'],
            'asset_limit' => $config['asset_limit'],
        ],
        'global' => [
            'active_cryptocurrencies' => (int) ($globalData['active_cryptocurrencies'] ?? 0),
            'markets' => (int) ($globalData['markets'] ?? 0),
            'bitcoin_dominance_percentage' => isset($globalData['market_cap_percentage']['btc']) ? (float) $globalData['market_cap_percentage']['btc'] : null,
            'total_market_cap' => isset($globalData['total_market_cap'][$currency]) ? (float) $globalData['total_market_cap'][$currency] : null,
            'total_volume_24h' => isset($globalData['total_volume'][$currency]) ? (float) $globalData['total_volume'][$currency] : null,
        ],
        'insights' => [
            'top_gainers_24h' => crypto_table_pick_assets($assets, 'percent_change_24h', true),
            'top_losers_24h' => crypto_table_pick_assets($assets, 'percent_change_24h', false),
            'volume_leaders' => crypto_table_pick_assets($assets, 'volume_24h', true),
        ],
        'assets' => $assets,
    ];
}

function crypto_table_pick_assets(array $assets, string $field, bool $desc): array
{
    $filtered = array_values(array_filter($assets, static function (array $asset) use ($field): bool {
        return isset($asset[$field]) && is_numeric($asset[$field]);
    }));

    usort($filtered, static function (array $left, array $right) use ($field, $desc): int {
        $leftValue = (float) $left[$field];
        $rightValue = (float) $right[$field];
        $comparison = $leftValue <=> $rightValue;
        return $desc ? -$comparison : $comparison;
    });

    return array_slice(array_map(static function (array $asset) use ($field): array {
        return [
            'id' => $asset['id'],
            'name' => $asset['name'],
            'symbol' => $asset['symbol'],
            'value' => $asset[$field],
        ];
    }, $filtered), 0, 5);
}

function crypto_table_http_get_json(string $url, int $timeout): array
{
    $response = crypto_table_http_get($url, $timeout);
    $data = json_decode($response, true);

    if (!is_array($data)) {
        throw new RuntimeException('Unable to decode provider response.');
    }

    return $data;
}

function crypto_table_http_get(string $url, int $timeout): string
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => $timeout,
            CURLOPT_TIMEOUT => $timeout,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'User-Agent: crypto-table/modern-refresh',
            ],
        ]);

        $response = curl_exec($ch);
        $statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($response === false || $statusCode >= 400) {
            throw new RuntimeException($error !== '' ? $error : 'Provider request failed with status ' . $statusCode . '.');
        }

        return (string) $response;
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => $timeout,
            'header' => "Accept: application/json\r\nUser-Agent: crypto-table/modern-refresh\r\n",
        ],
    ]);

    $response = @file_get_contents($url, false, $context);
    if ($response === false) {
        throw new RuntimeException('Provider request failed.');
    }

    return $response;
}

function crypto_table_build_archive_payload(string $currency, array $config, string $warning): ?array
{
    $dataRoot = dirname(__DIR__) . '/data';
    $directories = glob($dataRoot . '/*', GLOB_ONLYDIR) ?: [];
    rsort($directories, SORT_NATURAL);

    foreach ($directories as $directory) {
        $marketFiles = glob($directory . '/data*.json') ?: [];
        $globalFiles = glob($directory . '/gdata*.json') ?: [];
        if ($marketFiles === []) {
            continue;
        }

        natsort($marketFiles);
        $marketFiles = array_values($marketFiles);
        $latestMarketFile = end($marketFiles);
        $latestAssets = json_decode((string) file_get_contents((string) $latestMarketFile), true);
        if (!is_array($latestAssets)) {
            continue;
        }

        $recentMarketFiles = array_slice($marketFiles, -12);
        $history = [];
        foreach ($recentMarketFiles as $marketFile) {
            $snapshot = json_decode((string) file_get_contents($marketFile), true);
            if (!is_array($snapshot)) {
                continue;
            }
            foreach ($snapshot as $asset) {
                if (!is_array($asset) || !isset($asset['id'])) {
                    continue;
                }
                $priceField = 'price_' . $currency;
                if (isset($asset[$priceField]) && is_numeric($asset[$priceField])) {
                    $history[(string) $asset['id']][] = (float) $asset[$priceField];
                }
            }
        }

        $globalData = [];
        if ($globalFiles !== []) {
            natsort($globalFiles);
            $globalFiles = array_values($globalFiles);
            $latestGlobalFile = end($globalFiles);
            $globalData = json_decode((string) file_get_contents((string) $latestGlobalFile), true);
            if (!is_array($globalData)) {
                $globalData = [];
            }
        }

        $archiveRate = crypto_table_archive_exchange_rate($currency, $config, $globalData);

        $assets = array_map(static function (array $asset) use ($currency, $history, $archiveRate) {
            $priceField = 'price_' . $currency;
            $marketCapField = 'market_cap_' . $currency;
            $volumeField = '24h_volume_' . $currency;
            $lastUpdated = isset($asset['last_updated']) && is_numeric($asset['last_updated'])
                ? gmdate('c', (int) $asset['last_updated'])
                : '';
            $price = isset($asset[$priceField]) && is_numeric($asset[$priceField])
                ? (float) $asset[$priceField]
                : crypto_table_convert_archive_number($asset['price_usd'] ?? null, $archiveRate);
            $marketCap = isset($asset[$marketCapField]) && is_numeric($asset[$marketCapField])
                ? (float) $asset[$marketCapField]
                : crypto_table_convert_archive_number($asset['market_cap_usd'] ?? null, $archiveRate);
            $volume = isset($asset[$volumeField]) && is_numeric($asset[$volumeField])
                ? (float) $asset[$volumeField]
                : crypto_table_convert_archive_number($asset['24h_volume_usd'] ?? null, $archiveRate);

            return [
                'id' => (string) ($asset['id'] ?? ''),
                'rank' => (int) ($asset['rank'] ?? 0),
                'name' => (string) ($asset['name'] ?? ''),
                'symbol' => strtoupper((string) ($asset['symbol'] ?? '')),
                'image' => '',
                'price' => $price,
                'market_cap' => $marketCap,
                'volume_24h' => $volume,
                'available_supply' => isset($asset['available_supply']) ? (float) $asset['available_supply'] : null,
                'total_supply' => isset($asset['total_supply']) ? (float) $asset['total_supply'] : null,
                'max_supply' => null,
                'percent_change_1h' => isset($asset['percent_change_1h']) ? (float) $asset['percent_change_1h'] : null,
                'percent_change_24h' => isset($asset['percent_change_24h']) ? (float) $asset['percent_change_24h'] : null,
                'percent_change_7d' => isset($asset['percent_change_7d']) ? (float) $asset['percent_change_7d'] : null,
                'percent_change_30d' => null,
                'sparkline' => $history[(string) ($asset['id'] ?? '')] ?? [],
                'last_updated' => $lastUpdated,
                'details_url' => 'https://www.coingecko.com/en/coins/' . rawurlencode((string) ($asset['id'] ?? '')),
                'source_currency' => strtoupper($currency),
            ];
        }, $latestAssets);

        return [
            'meta' => [
                'currency' => strtoupper($currency),
                'currency_symbol' => crypto_table_currency_symbol($currency),
                'supported_currencies' => array_map('strtoupper', array_keys($config['supported_currencies'])),
                'provider' => 'Bundled archive data',
                'provider_url' => '',
                'fetched_at' => gmdate('c', filemtime((string) $latestMarketFile) ?: time()),
                'source_status' => 'seed-data',
                'stale' => true,
                'cache_ttl' => $config['cache_ttl'],
                'asset_limit' => count($assets),
                'warning' => 'Live market fetch failed (' . $warning . '). Showing the latest bundled archive snapshot.',
            ],
            'global' => [
                'active_cryptocurrencies' => (int) ($globalData['active_currencies'] ?? 0),
                'markets' => (int) ($globalData['active_markets'] ?? 0),
                'bitcoin_dominance_percentage' => isset($globalData['bitcoin_percentage_of_market_cap']) ? (float) $globalData['bitcoin_percentage_of_market_cap'] : null,
                'total_market_cap' => isset($globalData['total_market_cap_' . $currency]) ? (float) $globalData['total_market_cap_' . $currency] : crypto_table_convert_archive_number($globalData['total_market_cap_usd'] ?? null, $archiveRate),
                'total_volume_24h' => isset($globalData['total_24h_volume_' . $currency]) ? (float) $globalData['total_24h_volume_' . $currency] : crypto_table_convert_archive_number($globalData['total_24h_volume_usd'] ?? null, $archiveRate),
            ],
            'insights' => [
                'top_gainers_24h' => crypto_table_pick_assets($assets, 'percent_change_24h', true),
                'top_losers_24h' => crypto_table_pick_assets($assets, 'percent_change_24h', false),
                'volume_leaders' => crypto_table_pick_assets($assets, 'volume_24h', true),
            ],
            'assets' => $assets,
        ];
    }

    return null;
}

function crypto_table_archive_exchange_rate(string $currency, array $config, array $globalData): float
{
    if ($currency === 'usd') {
        return 1.0;
    }

    if ($currency === 'inr'
        && isset($globalData['total_market_cap_inr'], $globalData['total_market_cap_usd'])
        && is_numeric($globalData['total_market_cap_inr'])
        && is_numeric($globalData['total_market_cap_usd'])
        && (float) $globalData['total_market_cap_usd'] > 0.0) {
        return (float) $globalData['total_market_cap_inr'] / (float) $globalData['total_market_cap_usd'];
    }

    return (float) ($config['fallback_exchange_rates'][$currency] ?? 1.0);
}

function crypto_table_convert_archive_number(mixed $value, float $rate): ?float
{
    if (!is_numeric($value)) {
        return null;
    }

    return (float) $value * $rate;
}
