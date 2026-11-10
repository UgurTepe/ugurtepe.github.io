(() => {
    const counter = document.querySelector('.visitor-counter');
    const number = counter?.querySelector('.visitor-number');
    const productionHosts = ['ugurtepe.de', 'www.ugurtepe.de', 'ugurtepe.github.io'];
    const goatcounter = 'https://ugurtepe46.goatcounter.com';
    const statsTitle = counter?.getAttribute('aria-current') ? 'Download statistics.' : 'Open download statistics.';

    // Keep local previews from contributing to the counter.
    if (!productionHosts.includes(window.location.hostname)) {
        if (number) number.textContent = '—';
        if (counter) counter.title = statsTitle;
        return;
    }

    // GoatCounter records this page view; it skips bots and needs no cookies.
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://gc.zgo.at/count.js';
    script.dataset.goatcounter = `${goatcounter}/count`;
    document.head.append(script);

    if (!counter || !number) return;

    function unavailable() {
        number.textContent = '—';
        counter.title = `Visitor counter unavailable. ${statsTitle}`;
    }

    // GoatCounter returns a formatted string such as "1,234" and caches it for up to four hours.
    async function showVisitors() {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 8000);
        try {
            const response = await fetch(`${goatcounter}/counter/TOTAL.json`, {
                signal: controller.signal,
                cache: 'no-store',
                credentials: 'omit',
                referrerPolicy: 'no-referrer'
            });
            if (!response.ok) throw new Error('Counter request failed');
            const result = await response.json();
            const value = Number(String(result.count).replace(/[^\d]/g, ''));
            if (typeof result.count !== 'string' || !/\d/.test(result.count) || !Number.isSafeInteger(value)) {
                throw new Error('Invalid visitor count');
            }
            number.textContent = value.toLocaleString('en-US');
            counter.title = `Total visitors to this website, counted by GoatCounter and updated every few hours. ${statsTitle}`;
        } catch {
            unavailable();
        } finally {
            window.clearTimeout(timeout);
        }
    }

    showVisitors();
})();
