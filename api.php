<?php

declare(strict_types=1);

require_once __DIR__ . '/src/market_data.php';

if (PHP_SAPI === 'cli') {
    $currencies = array_slice($argv, 1);
    if ($currencies === []) {
        $currencies = array_keys(crypto_table_supported_currencies());
    }

    foreach ($currencies as $currency) {
        $normalizedCurrency = crypto_table_normalize_currency($currency);
        try {
            $payload = crypto_table_fetch_market_payload($normalizedCurrency, true);
            $fetchedAt = $payload['meta']['fetched_at'] ?? gmdate('c');
            fwrite(STDOUT, sprintf("Warmed %s cache at %s\n", strtoupper($normalizedCurrency), $fetchedAt));
        } catch (Throwable $exception) {
            fwrite(STDERR, sprintf("Failed to warm %s cache: %s\n", strtoupper($normalizedCurrency), $exception->getMessage()));
        }
    }

    exit(0);
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$currency = crypto_table_normalize_currency($_GET['currency'] ?? null);
$forceRefresh = isset($_GET['refresh']) && $_GET['refresh'] === '1';

try {
    $payload = crypto_table_fetch_market_payload($currency, $forceRefresh);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Unable to fetch market data.',
        'message' => $exception->getMessage(),
        'meta' => [
            'currency' => strtoupper($currency),
            'supported_currencies' => array_map('strtoupper', array_keys(crypto_table_supported_currencies())),
            'provider' => crypto_table_config()['provider_name'],
        ],
    ], JSON_UNESCAPED_SLASHES);
}
