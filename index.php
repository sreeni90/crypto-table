<?php

declare(strict_types=1);

require_once __DIR__ . '/src/market_data.php';

$supportedCurrencies = crypto_table_supported_currencies();
$defaultCurrency = strtoupper(crypto_table_default_currency());
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Crypto Table</title>
    <link href="assets/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="dist/bootstrap-table.min.css" rel="stylesheet">
    <link href="assets/css/crypto-table-modern.css" rel="stylesheet">
</head>
<body class="crypto-app">
<div class="container-fluid crypto-shell">
    <header class="crypto-hero">
        <div class="row">
            <div class="col-sm-8">
                <p class="crypto-eyebrow">Modern market overview</p>
                <h1>Crypto Table</h1>
                <p class="crypto-subtitle">Live crypto market data, multi-currency views, watchlists, saved presets, and seven-day trend sparklines.</p>
            </div>
            <div class="col-sm-4">
                <div class="crypto-status-panel">
                    <span id="statusBadge" class="label label-default">Loading</span>
                    <p class="status-row"><strong>Provider:</strong> <span id="providerName">-</span></p>
                    <p class="status-row"><strong>Last update:</strong> <span id="lastUpdatedLabel">-</span></p>
                    <p class="status-row"><strong>Cache TTL:</strong> <span id="cacheTtlLabel">-</span></p>
                </div>
            </div>
        </div>
    </header>

    <section id="staleWarning" class="alert alert-warning hidden"></section>

    <section class="crypto-toolbar panel panel-default">
        <div class="panel-body">
            <div class="row toolbar-row">
                <div class="col-sm-3 col-md-2">
                    <label for="currencySelect">Quote currency</label>
                    <select id="currencySelect" class="form-control">
                        <?php foreach ($supportedCurrencies as $code => $symbol): ?>
                            <option value="<?= htmlspecialchars(strtoupper($code), ENT_QUOTES, 'UTF-8') ?>"<?= strtoupper($code) === $defaultCurrency ? ' selected' : '' ?>><?= htmlspecialchars(strtoupper($code), ENT_QUOTES, 'UTF-8') ?> (<?= htmlspecialchars($symbol, ENT_QUOTES, 'UTF-8') ?>)</option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="col-sm-3 col-md-2">
                    <label for="presetSelect">Saved view</label>
                    <div class="input-group">
                        <select id="presetSelect" class="form-control"></select>
                        <span class="input-group-btn">
                            <button id="deletePresetButton" class="btn btn-default" type="button">Delete</button>
                        </span>
                    </div>
                </div>
                <div class="col-sm-6 col-md-4">
                    <label>Quick filters</label>
                    <div id="filterButtons" class="btn-group btn-group-sm btn-group-justified" role="group">
                        <a class="btn btn-default active" data-filter="all">All</a>
                        <a class="btn btn-default" data-filter="watchlist">Watchlist</a>
                        <a class="btn btn-default" data-filter="gainers">Gainers</a>
                        <a class="btn btn-default" data-filter="losers">Losers</a>
                        <a class="btn btn-default" data-filter="volume">Volume</a>
                    </div>
                </div>
                <div class="col-sm-12 col-md-4 toolbar-actions">
                    <button id="savePresetButton" class="btn btn-default" type="button"><span class="glyphicon glyphicon-floppy-disk"></span> Save view</button>
                    <button id="refreshButton" class="btn btn-primary" type="button"><span class="glyphicon glyphicon-refresh"></span> Refresh</button>
                </div>
            </div>
        </div>
    </section>

    <section class="row crypto-metrics">
        <div class="col-sm-6 col-lg-3">
            <div class="metric-card panel panel-default">
                <div class="panel-body">
                    <p class="metric-label">Total market cap</p>
                    <h3 id="metricMarketCap">-</h3>
                </div>
            </div>
        </div>
        <div class="col-sm-6 col-lg-3">
            <div class="metric-card panel panel-default">
                <div class="panel-body">
                    <p class="metric-label">24h volume</p>
                    <h3 id="metricVolume">-</h3>
                </div>
            </div>
        </div>
        <div class="col-sm-6 col-lg-3">
            <div class="metric-card panel panel-default">
                <div class="panel-body">
                    <p class="metric-label">BTC dominance</p>
                    <h3 id="metricDominance">-</h3>
                </div>
            </div>
        </div>
        <div class="col-sm-6 col-lg-3">
            <div class="metric-card panel panel-default">
                <div class="panel-body">
                    <p class="metric-label">Watchlist assets</p>
                    <h3 id="metricWatchlist">0</h3>
                </div>
            </div>
        </div>
    </section>

    <section class="row insight-grid">
        <div class="col-md-4">
            <div class="panel panel-default insight-card">
                <div class="panel-heading">Top gainers (24h)</div>
                <ul id="gainersList" class="list-group"></ul>
            </div>
        </div>
        <div class="col-md-4">
            <div class="panel panel-default insight-card">
                <div class="panel-heading">Top losers (24h)</div>
                <ul id="losersList" class="list-group"></ul>
            </div>
        </div>
        <div class="col-md-4">
            <div class="panel panel-default insight-card">
                <div class="panel-heading">Volume leaders</div>
                <ul id="volumeList" class="list-group"></ul>
            </div>
        </div>
    </section>

    <section class="panel panel-default table-panel">
        <div class="panel-heading table-heading">
            <div>
                <strong>Market board</strong>
                <p class="table-heading-copy">Search, sort, toggle columns, export, and save your preferred layout.</p>
            </div>
            <div class="table-heading-meta">
                <span id="assetCountLabel">0 assets</span>
                <span class="separator">•</span>
                <span id="marketCountLabel">0 markets</span>
            </div>
        </div>
        <div class="panel-body">
            <table id="marketTable"></table>
        </div>
    </section>
</div>

<script>
window.CRYPTO_TABLE_CONFIG = {
    defaultCurrency: <?= json_encode($defaultCurrency) ?>,
    supportedCurrencies: <?= json_encode(array_map('strtoupper', array_keys($supportedCurrencies))) ?>,
    apiUrl: 'api.php'
};
</script>
<script src="assets/js/jquery.min.js"></script>
<script src="assets/bootstrap/js/bootstrap.min.js"></script>
<script src="dist/bootstrap-table.min.js"></script>
<script src="assets/js/export.js"></script>
<script src="assets/js/crypto-table-app.js"></script>
</body>
</html>
