(function ($) {
    'use strict';

    var config = window.CRYPTO_TABLE_CONFIG || {};
    var WATCHLIST_KEY = 'cryptoTable.watchlist';
    var PREFS_KEY = 'cryptoTable.preferences';
    var PRESETS_KEY = 'cryptoTable.presets';
    var state = {
        currency: loadPreferences().currency || config.defaultCurrency || 'USD',
        filter: loadPreferences().filter || 'all',
        hiddenColumns: loadPreferences().hiddenColumns || [],
        searchText: loadPreferences().searchText || '',
        sortName: loadPreferences().sortName || 'rank',
        sortOrder: loadPreferences().sortOrder || 'asc',
        payload: null,
        assets: [],
        filteredAssets: [],
        watchlist: loadWatchlist(),
        presets: loadPresets()
    };
    var $table = $('#marketTable');
    var allColumnFields = ['watchlist', 'rank', 'name', 'price', 'percent_change_24h', 'percent_change_7d', 'percent_change_30d', 'market_cap', 'volume_24h', 'available_supply', 'sparkline', 'last_updated', 'details_url'];

    function loadPreferences() {
        try {
            return JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
        } catch (error) {
            return {};
        }
    }

    function savePreferences() {
        localStorage.setItem(PREFS_KEY, JSON.stringify({
            currency: state.currency,
            filter: state.filter,
            hiddenColumns: state.hiddenColumns,
            searchText: state.searchText,
            sortName: state.sortName,
            sortOrder: state.sortOrder
        }));
    }

    function loadWatchlist() {
        try {
            return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]');
        } catch (error) {
            return [];
        }
    }

    function saveWatchlist() {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(state.watchlist));
        renderMetrics();
    }

    function loadPresets() {
        try {
            return JSON.parse(localStorage.getItem(PRESETS_KEY) || '{}');
        } catch (error) {
            return {};
        }
    }

    function savePresets() {
        localStorage.setItem(PRESETS_KEY, JSON.stringify(state.presets));
        populatePresetSelect();
    }

    function init() {
        initTable();
        bindControls();
        populatePresetSelect();
        $('#currencySelect').val(state.currency);
        setActiveFilterButton(state.filter);
        renderMetrics();
        loadMarketData(false);
    }

    function initTable() {
        window.watchlistEvents = {
            'click .watchlist-toggle': function (event, value, row) {
                event.preventDefault();
                toggleWatchlist(row.id);
            }
        };

        $table.bootstrapTable({
            columns: [[
                {
                    field: 'watchlist',
                    title: '',
                    align: 'center',
                    width: 40,
                    formatter: watchlistFormatter,
                    events: window.watchlistEvents
                },
                {
                    field: 'rank',
                    title: '#',
                    sortable: true,
                    width: 60
                },
                {
                    field: 'name',
                    title: 'Asset',
                    sortable: true,
                    formatter: assetFormatter
                },
                {
                    field: 'price',
                    title: 'Price',
                    sortable: true,
                    formatter: currencyFormatter
                },
                {
                    field: 'percent_change_24h',
                    title: '24h',
                    sortable: true,
                    formatter: percentFormatter
                },
                {
                    field: 'percent_change_7d',
                    title: '7d',
                    sortable: true,
                    formatter: percentFormatter
                },
                {
                    field: 'percent_change_30d',
                    title: '30d',
                    sortable: true,
                    formatter: percentFormatter
                },
                {
                    field: 'market_cap',
                    title: 'Market cap',
                    sortable: true,
                    formatter: currencyFormatter
                },
                {
                    field: 'volume_24h',
                    title: '24h volume',
                    sortable: true,
                    formatter: currencyFormatter
                },
                {
                    field: 'available_supply',
                    title: 'Supply',
                    sortable: true,
                    formatter: supplyFormatter
                },
                {
                    field: 'sparkline',
                    title: '7d trend',
                    sortable: false,
                    formatter: sparklineFormatter
                },
                {
                    field: 'last_updated',
                    title: 'Updated',
                    sortable: true,
                    formatter: updatedFormatter
                },
                {
                    field: 'details_url',
                    title: 'Details',
                    formatter: linkFormatter
                }
            ]],
            data: [],
            search: true,
            pagination: true,
            pageSize: 10,
            pageList: [10, 25, 50, 100],
            showColumns: true,
            showToggle: true,
            sortName: state.sortName,
            sortOrder: state.sortOrder,
            searchText: state.searchText,
            iconsPrefix: 'glyphicon',
            undefinedText: '—'
        });

        $table.on('column-switch.bs.table', function (event, field, checked) {
            if (checked) {
                state.hiddenColumns = $.grep(state.hiddenColumns, function (hiddenField) {
                    return hiddenField !== field;
                });
            } else if ($.inArray(field, state.hiddenColumns) === -1) {
                state.hiddenColumns.push(field);
            }
            savePreferences();
        });

        $table.on('search.bs.table', function (event, text) {
            state.searchText = text || '';
            savePreferences();
        });

        $table.on('sort.bs.table', function (event, name, order) {
            state.sortName = name;
            state.sortOrder = order;
            savePreferences();
        });

        syncColumns();
    }

    function syncColumns() {
        $.each(allColumnFields, function (index, field) {
            $table.bootstrapTable('showColumn', field);
        });

        $.each(state.hiddenColumns, function (index, field) {
            $table.bootstrapTable('hideColumn', field);
        });
    }

    function bindControls() {
        $('#currencySelect').on('change', function () {
            state.currency = String($(this).val() || config.defaultCurrency || 'USD').toUpperCase();
            savePreferences();
            loadMarketData(false);
        });

        $('#refreshButton').on('click', function () {
            loadMarketData(true);
        });

        $('#filterButtons').on('click', '[data-filter]', function () {
            state.filter = $(this).data('filter');
            setActiveFilterButton(state.filter);
            savePreferences();
            renderTable();
        });

        $('#savePresetButton').on('click', function () {
            var name = window.prompt('Save this view as:', 'My view');
            if (!name) {
                return;
            }

            state.presets[name] = {
                currency: state.currency,
                filter: state.filter,
                hiddenColumns: state.hiddenColumns.slice(0),
                searchText: state.searchText,
                sortName: state.sortName,
                sortOrder: state.sortOrder
            };
            savePresets();
            $('#presetSelect').val(name);
        });

        $('#presetSelect').on('change', function () {
            var presetName = $(this).val();
            if (!presetName || !state.presets[presetName]) {
                return;
            }
            applyPreset(state.presets[presetName]);
        });

        $('#deletePresetButton').on('click', function () {
            var presetName = $('#presetSelect').val();
            if (!presetName || !state.presets[presetName]) {
                return;
            }
            delete state.presets[presetName];
            savePresets();
        });
    }

    function applyPreset(preset) {
        state.currency = String(preset.currency || config.defaultCurrency || 'USD').toUpperCase();
        state.filter = preset.filter || 'all';
        state.hiddenColumns = preset.hiddenColumns || [];
        state.searchText = preset.searchText || '';
        state.sortName = preset.sortName || 'rank';
        state.sortOrder = preset.sortOrder || 'asc';
        savePreferences();
        $('#currencySelect').val(state.currency);
        setActiveFilterButton(state.filter);
        loadMarketData(false);
    }

    function populatePresetSelect() {
        var options = ['<option value="">Saved views</option>'];
        $.each(Object.keys(state.presets).sort(), function (index, key) {
            options.push('<option value="' + escapeHtml(key) + '">' + escapeHtml(key) + '</option>');
        });
        $('#presetSelect').html(options.join(''));
    }

    function setActiveFilterButton(filter) {
        $('#filterButtons [data-filter]').removeClass('active');
        $('#filterButtons [data-filter="' + filter + '"]').addClass('active');
    }

    function loadMarketData(forceRefresh) {
        $('#refreshButton').prop('disabled', true);
        $('#statusBadge').removeClass('status-live status-fresh-cache status-stale-cache status-error').addClass('label label-default').text('Loading');

        $.ajax({
            url: config.apiUrl,
            dataType: 'json',
            cache: false,
            data: {
                currency: state.currency,
                refresh: forceRefresh ? 1 : 0
            }
        }).done(function (payload) {
            if (payload.error) {
                renderError(payload.message || payload.error);
                return;
            }

            state.payload = payload;
            state.assets = payload.assets || [];
            renderStatus(payload.meta || {});
            renderMetrics();
            renderInsights(payload.insights || {});
            renderTable();
        }).fail(function (xhr) {
            var message = 'Request failed.';
            if (xhr && xhr.responseJSON && xhr.responseJSON.message) {
                message = xhr.responseJSON.message;
            }
            renderError(message);
        }).always(function () {
            $('#refreshButton').prop('disabled', false);
        });
    }

    function renderError(message) {
        $('#statusBadge').removeClass('label-default').addClass('label status-error').text('Error');
        $('#staleWarning').removeClass('hidden').text(message);
        $table.bootstrapTable('load', []);
        $('#assetCountLabel').text('0 assets');
    }

    function renderStatus(meta) {
        var statusText = meta.source_status || 'live';
        var statusClass = 'status-live';
        if (statusText === 'fresh-cache') {
            statusClass = 'status-fresh-cache';
        } else if (statusText === 'stale-cache') {
            statusClass = 'status-stale-cache';
        }

        $('#statusBadge')
            .removeClass('label-default status-live status-fresh-cache status-stale-cache status-error')
            .addClass('label ' + statusClass)
            .text(statusText.replace('-', ' '));
        $('#providerName').text(meta.provider || '-');
        $('#lastUpdatedLabel').text(formatDateTime(meta.fetched_at));
        $('#cacheTtlLabel').text(meta.cache_ttl ? meta.cache_ttl + 's' : '-');

        if (meta.stale && meta.warning) {
            $('#staleWarning').removeClass('hidden').text('Showing cached data: ' + meta.warning);
        } else {
            $('#staleWarning').addClass('hidden').text('');
        }
    }

    function renderMetrics() {
        var global = state.payload && state.payload.global ? state.payload.global : {};
        $('#metricMarketCap').text(formatCurrency(global.total_market_cap));
        $('#metricVolume').text(formatCurrency(global.total_volume_24h));
        $('#metricDominance').text(formatPercentText(global.bitcoin_dominance_percentage));
        $('#metricWatchlist').text(state.watchlist.length);
        $('#marketCountLabel').text((global.markets || 0) + ' markets');
    }

    function renderInsights(insights) {
        populateInsightList('#gainersList', insights.top_gainers_24h || [], true, false);
        populateInsightList('#losersList', insights.top_losers_24h || [], false, false);
        populateInsightList('#volumeList', insights.volume_leaders || [], true, true);
    }

    function populateInsightList(selector, items, positive, currencyValues) {
        if (!items.length) {
            $(selector).html('<li class="list-group-item">No data available.</li>');
            return;
        }

        var html = [];
        $.each(items, function (index, item) {
            html.push('<li class="list-group-item">');
            html.push('<span><strong>' + escapeHtml(item.name) + '</strong> <span class="asset-symbol">' + escapeHtml(item.symbol) + '</span></span>');
            html.push('<span class="' + (positive ? 'change-positive' : 'change-negative') + '">' + (currencyValues ? formatCurrency(item.value) : formatPercentText(item.value)) + '</span>');
            html.push('</li>');
        });
        $(selector).html(html.join(''));
    }

    function renderTable() {
        var assets = state.assets.slice(0);
        var watchlistLookup = makeLookup(state.watchlist);

        if (state.filter === 'watchlist') {
            assets = $.grep(assets, function (asset) {
                return !!watchlistLookup[asset.id];
            });
        } else if (state.filter === 'gainers') {
            assets = $.grep(assets, function (asset) {
                return Number(asset.percent_change_24h || 0) > 0;
            }).sort(function (left, right) {
                return Number(right.percent_change_24h || 0) - Number(left.percent_change_24h || 0);
            });
        } else if (state.filter === 'losers') {
            assets = $.grep(assets, function (asset) {
                return Number(asset.percent_change_24h || 0) < 0;
            }).sort(function (left, right) {
                return Number(left.percent_change_24h || 0) - Number(right.percent_change_24h || 0);
            });
        } else if (state.filter === 'volume') {
            assets = assets.sort(function (left, right) {
                return Number(right.volume_24h || 0) - Number(left.volume_24h || 0);
            });
        }

        state.filteredAssets = assets;
        $table.bootstrapTable('load', assets);
        $table.bootstrapTable('resetSearch', state.searchText);
        $table.bootstrapTable('sortBy', {
            field: state.sortName,
            sortOrder: state.sortOrder
        });

        syncColumns();
        $('#assetCountLabel').text(assets.length + ' assets');
    }

    function makeLookup(values) {
        var lookup = {};
        $.each(values, function (index, value) {
            lookup[value] = true;
        });
        return lookup;
    }

    function toggleWatchlist(assetId) {
        if (!assetId) {
            return;
        }

        if ($.inArray(assetId, state.watchlist) === -1) {
            state.watchlist.push(assetId);
        } else {
            state.watchlist = $.grep(state.watchlist, function (value) {
                return value !== assetId;
            });
        }

        saveWatchlist();
        renderTable();
    }

    function watchlistFormatter(value, row) {
        var active = $.inArray(row.id, state.watchlist) !== -1;
        return '<button class="watchlist-toggle ' + (active ? 'active' : '') + '" type="button" title="Toggle watchlist">★</button>';
    }

    function assetFormatter(value, row) {
        var media = row.image ? '<img class="asset-icon" src="' + escapeAttribute(row.image) + '" alt="' + escapeAttribute(row.symbol || row.name) + '">' : '<span class="asset-fallback">' + escapeHtml((row.symbol || '?').slice(0, 1)) + '</span>';
        return [
            '<div class="asset-cell">',
            media,
            '<div>',
            '<div class="asset-name">' + escapeHtml(row.name || '') + '</div>',
            '<span class="asset-symbol">' + escapeHtml(row.symbol || '') + '</span>',
            '</div>',
            '</div>'
        ].join('');
    }

    function currencyFormatter(value) {
        return formatCurrency(value);
    }

    function percentFormatter(value) {
        return formatPercentHtml(value);
    }

    function supplyFormatter(value, row) {
        var totalSupply = row.total_supply ? '<div class="supply-meta">Total: ' + formatNumber(row.total_supply) + '</div>' : '';
        return '<div>' + formatNumber(value) + totalSupply + '</div>';
    }

    function sparklineFormatter(value, row) {
        return renderSparkline(row.sparkline || []);
    }

    function updatedFormatter(value) {
        return '<div>' + formatRelativeTime(value) + '<div class="updated-meta">' + formatDateTime(value) + '</div></div>';
    }

    function linkFormatter(value, row) {
        return '<a class="btn btn-default btn-xs" target="_blank" rel="noopener" href="' + escapeAttribute(row.details_url || '#') + '">Open</a>';
    }

    function formatCurrency(value) {
        if (value === null || value === undefined || value === '') {
            return '—';
        }

        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: state.currency,
                notation: Math.abs(Number(value)) >= 1000000000 ? 'compact' : 'standard',
                maximumFractionDigits: Math.abs(Number(value)) >= 1 ? 2 : 6
            }).format(Number(value));
        } catch (error) {
            return state.currency + ' ' + formatNumber(value);
        }
    }

    function formatNumber(value) {
        if (value === null || value === undefined || value === '') {
            return '—';
        }

        try {
            return new Intl.NumberFormat('en-US', {
                notation: Math.abs(Number(value)) >= 1000000000 ? 'compact' : 'standard',
                maximumFractionDigits: Math.abs(Number(value)) >= 1 ? 2 : 6
            }).format(Number(value));
        } catch (error) {
            return String(value);
        }
    }

    function formatPercentText(value) {
        if (value === null || value === undefined || value === '') {
            return '—';
        }

        var numericValue = Number(value);
        var cssClass = numericValue > 0 ? 'change-positive' : (numericValue < 0 ? 'change-negative' : '');
        var sign = numericValue > 0 ? '+' : '';
        return sign + numericValue.toFixed(2) + '%';
    }

    function formatPercentHtml(value) {
        if (value === null || value === undefined || value === '') {
            return '—';
        }

        var numericValue = Number(value);
        var cssClass = numericValue > 0 ? 'change-positive' : (numericValue < 0 ? 'change-negative' : '');
        return '<span class="' + cssClass + '">' + formatPercentText(numericValue) + '</span>';
    }

    function renderSparkline(points) {
        if (!points || !points.length) {
            return '—';
        }

        var values = $.map(points, function (point) {
            return Number(point);
        });
        var min = Math.min.apply(null, values);
        var max = Math.max.apply(null, values);
        var range = max - min || 1;
        var polyline = [];
        var width = 120;
        var height = 34;
        var className = values[values.length - 1] > values[0] ? 'trend-up' : (values[values.length - 1] < values[0] ? 'trend-down' : 'trend-flat');

        $.each(values, function (index, point) {
            var x = (index / Math.max(values.length - 1, 1)) * width;
            var y = height - (((point - min) / range) * height);
            polyline.push(x.toFixed(2) + ',' + y.toFixed(2));
        });

        return '<svg class="sparkline ' + className + '" viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="none"><polyline points="' + polyline.join(' ') + '"></polyline></svg>';
    }

    function formatRelativeTime(value) {
        if (!value) {
            return '—';
        }

        var timestamp = Date.parse(value);
        if (isNaN(timestamp)) {
            return '—';
        }

        var delta = Math.round((Date.now() - timestamp) / 1000);
        if (delta < 60) {
            return delta + 's ago';
        }
        if (delta < 3600) {
            return Math.round(delta / 60) + 'm ago';
        }
        if (delta < 86400) {
            return Math.round(delta / 3600) + 'h ago';
        }
        return Math.round(delta / 86400) + 'd ago';
    }

    function formatDateTime(value) {
        if (!value) {
            return '—';
        }

        var timestamp = Date.parse(value);
        if (isNaN(timestamp)) {
            return '—';
        }

        try {
            return new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
            }).format(timestamp);
        } catch (error) {
            return new Date(timestamp).toUTCString();
        }
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeAttribute(value) {
        return escapeHtml(value).replace(/`/g, '&#96;');
    }

    $(init);
}(jQuery));
