# crypto-table

A refreshed PHP + Bootstrap crypto market dashboard with live CoinGecko data, multi-currency views, watchlists, saved table presets, and 7-day sparklines.

## Features

- Maintained market data provider via CoinGecko
- TTL-based JSON cache with stale-cache fallback
- Quote currency switcher for USD, INR, EUR, and GBP
- Responsive dashboard cards and market status indicators
- Local watchlist persistence in the browser
- Saved sort/filter/column presets per browser session
- 7-day sparkline trends plus 24h / 7d / 30d performance columns

## Requirements

- PHP 8+
- `curl` enabled for the best API compatibility

## Local usage

Serve the repository with PHP:

```bash
php -S localhost:8000 -t /home/runner/work/crypto-table/crypto-table
```

Then open `http://localhost:8000`.

## Cache warming

Warm all configured currencies:

```bash
php /home/runner/work/crypto-table/crypto-table/api.php
```

Warm specific currencies:

```bash
php /home/runner/work/crypto-table/crypto-table/api.php usd inr eur
```

## Runtime configuration

Optional environment variables:

- `CRYPTO_TABLE_DEFAULT_CURRENCY` — default quote currency (`usd`, `inr`, `eur`, `gbp`)
- `CRYPTO_TABLE_CACHE_TTL` — cache lifetime in seconds (default `300`)
- `CRYPTO_TABLE_ASSET_LIMIT` — number of assets to fetch per refresh (default `100`, max `250`)

## API endpoint

The frontend loads normalized market data from:

```text
/home/runner/work/crypto-table/crypto-table/api.php?currency=USD
```

Use `refresh=1` to bypass the cache for a request.
