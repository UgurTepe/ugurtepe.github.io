(() => {
    const counter = document.querySelector('.visitor-counter');
    if (!counter) return;

    const number = counter.querySelector('.visitor-number');
    const endpoint = 'https://abacus.jasoncameron.dev/hit/ugurtepe.de/page-hits';
    const productionHosts = ['ugurtepe.de', 'www.ugurtepe.de', 'ugurtepe.github.io'];

    function showVisit(value) {
        number.textContent = value.toLocaleString('en-US');
    }

    function validVisit(value) {
        return Number.isSafeInteger(value) && value > 0;
    }

    // Keep local previews from contributing to the public counter.
    if (!productionHosts.includes(window.location.hostname)) {
        number.textContent = '\u2014';
        counter.title = 'Page counter preview; local page views are not counted.';
        return;
    }

    async function countVisit() {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch(endpoint, {
                signal: controller.signal,
                cache: 'no-store',
                credentials: 'omit',
                referrerPolicy: 'no-referrer'
            });
            if (!response.ok) throw new Error('Counter request failed');
            const result = await response.json();
            if (!validVisit(result.value)) throw new Error('Invalid visit number');

            showVisit(result.value);
        } catch {
            number.textContent = '\u2014';
            counter.title = 'Page view counter unavailable';
        } finally {
            window.clearTimeout(timeout);
        }
    }

    countVisit();
})();
