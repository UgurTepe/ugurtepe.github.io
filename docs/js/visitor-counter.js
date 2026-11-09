(() => {
    const counter = document.querySelector('.visitor-counter');
    const number = counter?.querySelector('.visitor-number');
    const label = counter?.querySelector('.visitor-label');
    const productionHosts = ['ugurtepe.de', 'www.ugurtepe.de', 'ugurtepe.github.io'];
    const goatcounter = 'https://ugurtepe46.goatcounter.com';
    const abacusEndpoint = 'https://abacus.jasoncameron.dev/hit/ugurtepe.de/page-hits';
    const statsTitle = counter?.getAttribute('aria-current') ? 'Download statistics.' : 'Open download statistics.';

    // Keep local previews from contributing to either counter.
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

    async function fetchJson(url) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 8000);
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                cache: 'no-store',
                credentials: 'omit',
                referrerPolicy: 'no-referrer'
            });
            if (!response.ok) throw new Error('Counter request failed');
            return await response.json();
        } finally {
            window.clearTimeout(timeout);
        }
    }

    // Abacus keeps counting every page load as a backup, even when GoatCounter works.
    const abacus = fetchJson(abacusEndpoint).then((result) => {
        if (!Number.isSafeInteger(result.value) || result.value <= 0) throw new Error('Invalid page view count');
        return result.value;
    });

    if (!counter || !number) {
        abacus.catch(() => {});
        return;
    }

    // GoatCounter returns a formatted string such as "1,234" and caches it for up to four hours.
    const visitors = fetchJson(`${goatcounter}/counter/TOTAL.json`).then((result) => {
        const value = Number(String(result.count).replace(/[^\d]/g, ''));
        if (typeof result.count !== 'string' || !Number.isSafeInteger(value) || value <= 0) {
            throw new Error('Invalid visitor count');
        }
        return value;
    });

    function show(value, text, title) {
        number.textContent = value.toLocaleString('en-US');
        if (label) label.textContent = text;
        counter.title = `${title} ${statsTitle}`;
    }

    visitors.then(
        (value) => show(value, 'Visitors', 'Total visitors to this website, counted by GoatCounter and updated every few hours.'),
        () => abacus.then(
            (value) => show(value, 'Page views', 'Total page views across this website. Reloads count again.'),
            () => {
                number.textContent = '—';
                counter.title = `Visitor counter unavailable. ${statsTitle}`;
            }
        )
    );
    abacus.catch(() => {});
})();
