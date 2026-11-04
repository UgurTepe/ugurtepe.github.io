(() => {
    const list = document.querySelector('#download-rows');
    if (!list || !window.downloadCounter) return;

    const search = document.querySelector('#download-search');
    const refresh = document.querySelector('#download-refresh');
    const status = document.querySelector('#download-status');
    const total = document.querySelector('#download-total');
    const fileTotal = document.querySelector('#download-file-total');
    const resultCount = document.querySelector('#download-results');
    const emptyRow = document.querySelector('#download-empty');
    const sortButtons = [...document.querySelectorAll('[data-sort]')];
    const collator = new Intl.Collator('en', {numeric: true, sensitivity: 'base'});
    const records = (window.downloadFiles || []).map((file) => ({
        ...file,
        count: null,
        row: [...list.querySelectorAll('[data-file]')].find((row) => row.dataset.file === file.path)
    }));
    let sortKey = 'count';
    let direction = 'descending';
    let loading = false;

    search.disabled = false;
    sortButtons.forEach((button) => { button.disabled = false; });
    fileTotal.textContent = records.length.toLocaleString('en-US');

    function render() {
        const query = search.value.trim().toLowerCase();
        const sorted = [...records].sort((a, b) => {
            // Missing counts stay at the bottom in either direction.
            if (sortKey === 'count' && (a.count === null || b.count === null)) {
                if (a.count !== b.count) return a.count === null ? 1 : -1;
            }
            let comparison = sortKey === 'title'
                ? collator.compare(a.title, b.title)
                : (a[sortKey] ?? 0) - (b[sortKey] ?? 0);
            if (direction === 'descending') comparison *= -1;
            return comparison || collator.compare(a.title, b.title);
        });
        let visible = 0;
        sorted.forEach((record) => {
            const matches = `${record.title} ${record.path}`.toLowerCase().includes(query);
            record.row.hidden = !matches;
            if (matches) visible += 1;
            const cell = record.row.querySelector('.download-count');
            cell.textContent = record.count === null ? '\u2014' : record.count.toLocaleString('en-US');
            cell.setAttribute('aria-label', record.count === null
                ? 'Download count unavailable'
                : `${record.count.toLocaleString('en-US')} download clicks`);
            list.append(record.row);
        });
        list.append(emptyRow);
        emptyRow.hidden = visible !== 0;
        resultCount.hidden = !query;
        resultCount.textContent = query ? `${visible} of ${records.length} documents` : `${records.length} documents`;

        const known = records.filter((record) => record.count !== null);
        const sum = known.reduce((value, record) => value + record.count, 0);
        total.textContent = known.length
            ? `${known.length === records.length ? '' : '\u2265 '}${sum.toLocaleString('en-US')}`
            : '\u2014';
        sortButtons.forEach((button) => {
            const active = button.dataset.sort === sortKey;
            const label = {title: 'name', bytes: 'size', count: 'downloads'}[button.dataset.sort];
            button.setAttribute('aria-pressed', String(active));
            button.setAttribute('aria-label', active
                ? `Sort by ${label}; currently ${direction}`
                : `Sort by ${label}`);
            button.querySelector('.sort-arrow').textContent = active
                ? (direction === 'ascending' ? '\u2191' : '\u2193')
                : '\u2195';
        });
    }

    async function loadCounts() {
        if (loading || !window.downloadCounter.isProduction) return;
        loading = true;
        refresh.disabled = true;
        list.setAttribute('aria-busy', 'true');
        let failed = 0;
        let completed = 0;
        status.textContent = 'Loading download counts\u2026';

        // Five documents fit comfortably below the API limit. Pace larger future inventories too.
        for (let offset = 0; offset < records.length; offset += 2) {
            if (offset) await new Promise((resolve) => window.setTimeout(resolve, 1000));
            await Promise.all(records.slice(offset, offset + 2).map(async (record) => {
                try {
                    const value = await window.downloadCounter.read(record.key);
                    record.count = Math.max(record.count ?? 0, value);
                } catch {
                    record.count = null;
                    failed += 1;
                }
                completed += 1;
            }));
            render();
            status.textContent = `Loading counts\u2026 ${completed} of ${records.length} documents`;
        }

        status.textContent = failed
            ? 'Some counts are unavailable. You can still open every document; try refreshing the counts.'
            : `Counts updated at ${new Intl.DateTimeFormat('en-GB', {hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date())}.`;
        list.setAttribute('aria-busy', 'false');
        loading = false;
        refresh.disabled = false;
    }

    sortButtons.forEach((button) => button.addEventListener('click', () => {
        const next = button.dataset.sort;
        direction = sortKey === next
            ? (direction === 'ascending' ? 'descending' : 'ascending')
            : (next === 'title' ? 'ascending' : 'descending');
        sortKey = next;
        render();
    }));
    search.addEventListener('input', render);
    refresh.addEventListener('click', loadCounts);
    document.addEventListener('download-counted', (event) => {
        const record = records.find((file) => file.path === event.detail.path);
        if (!record) return;
        record.count = event.detail.value;
        render();
    });

    render();
    if (window.downloadCounter.isProduction) {
        loadCounts();
    } else {
        status.textContent = '';
        refresh.disabled = true;
    }
})();
