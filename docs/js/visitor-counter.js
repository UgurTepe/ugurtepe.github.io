(() => {
    const counter = document.querySelector('.visitor-counter');
    if (!counter) return;

    const number = counter.querySelector('.visitor-number');
    const api = 'https://abacus.jasoncameron.dev';
    const counterPath = 'ugurtepe.de/page-hits';
    const productionHosts = ['ugurtepe.de', 'www.ugurtepe.de', 'ugurtepe.github.io'];
    let current = 0;
    let stream = null;

    function showVisit(value) {
        // Ignore stale or out-of-order values; the total only ever grows.
        if (value < current) return;
        current = value;
        number.textContent = value.toLocaleString('en-US');
    }

    function validVisit(value) {
        return Number.isSafeInteger(value) && value > 0;
    }

    // Keep local previews from contributing to the public counter.
    if (!productionHosts.includes(window.location.hostname)) {
        number.textContent = '—';
        counter.title = 'Open download statistics.';
        return;
    }

    // Live updates: Abacus pushes the new total whenever anyone visits.
    function openStream() {
        if (stream || !('EventSource' in window)) return;
        stream = new EventSource(`${api}/stream/${counterPath}`);
        stream.onmessage = (event) => {
            try {
                const result = JSON.parse(event.data);
                if (validVisit(result.value)) showVisit(result.value);
            } catch {}
        };
        // EventSource reconnects by itself; the last known total stays visible meanwhile.
    }

    function closeStream() {
        stream?.close();
        stream = null;
    }

    // Only hold a connection open while the page is visible.
    function syncStream() {
        if (document.visibilityState === 'visible') openStream();
        else closeStream();
    }

    async function countVisit() {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch(`${api}/hit/${counterPath}`, {
                signal: controller.signal,
                cache: 'no-store',
                credentials: 'omit',
                referrerPolicy: 'no-referrer'
            });
            if (!response.ok) throw new Error('Counter request failed');
            const result = await response.json();
            if (!validVisit(result.value)) throw new Error('Invalid visit number');

            showVisit(result.value);
            // Silence screen-reader announcements for the live updates that follow.
            number.setAttribute('aria-live', 'off');

            syncStream();
            document.addEventListener('visibilitychange', syncStream);
            // Close before leaving so the page can enter the back/forward cache.
            window.addEventListener('pagehide', closeStream);
            window.addEventListener('pageshow', (event) => { if (event.persisted) syncStream(); });
        } catch {
            number.textContent = '—';
            counter.title = 'Page view counter unavailable. Open download statistics.';
        } finally {
            window.clearTimeout(timeout);
        }
    }

    countVisit();
})();
