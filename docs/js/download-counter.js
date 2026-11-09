(() => {
    const productionHosts = ['ugurtepe.de', 'www.ugurtepe.de', 'ugurtepe.github.io'];
    const isProduction = productionHosts.includes(window.location.hostname);
    const api = 'https://abacus.jasoncameron.dev';
    const files = window.downloadFiles || [];
    const filesByPath = new Map(files.map((file) => [file.path, file]));

    async function request(operation, key) {
        if (!isProduction) return null;

        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 8000);
        try {
            const response = await fetch(`${api}/${operation}/ugurtepe.de/${encodeURIComponent(key)}`, {
                signal: controller.signal,
                cache: 'no-store',
                credentials: 'omit',
                referrerPolicy: 'no-referrer',
                // Let the counter request finish when a document opens in the same tab.
                keepalive: operation === 'hit'
            });
            if (operation === 'get' && response.status === 404) return 0;
            if (!response.ok) throw new Error('Download counter unavailable');
            const result = await response.json();
            if (!Number.isSafeInteger(result.value) || result.value < 0) {
                throw new Error('Invalid download count');
            }
            return result.value;
        } finally {
            window.clearTimeout(timeout);
        }
    }

    window.downloadCounter = Object.freeze({
        isProduction,
        read: (key) => request('get', key)
    });

    function countDownload(event) {
        if (!isProduction || event.defaultPrevented) return;
        if (event.type === 'click' && event.button !== 0) return;
        if (event.type === 'auxclick' && event.button !== 1) return;

        const link = event.target.closest?.('a[href]');
        if (!link) return;

        let file;
        try {
            const url = new URL(link.href, window.location.href);
            if (!['https:', 'http:'].includes(url.protocol) || !productionHosts.includes(url.hostname)) return;
            // Queries and PDF page fragments refer to the same document.
            file = filesByPath.get(decodeURIComponent(url.pathname).replace(/^\//, ''));
        } catch {
            return;
        }
        if (!file) return;

        // Also record the click as a GoatCounter event; Abacus stays the source for the statistics page.
        try {
            window.goatcounter?.count?.({path: `download-${file.path}`, title: file.title, event: true});
        } catch {}

        // Never hold up the file, retry an increment, or change normal link behaviour.
        request('hit', file.key).then((value) => {
            document.dispatchEvent(new CustomEvent('download-counted', {
                detail: {path: file.path, value}
            }));
        }).catch(() => {});
    }

    document.addEventListener('click', countDownload);
    document.addEventListener('auxclick', countDownload);
})();
