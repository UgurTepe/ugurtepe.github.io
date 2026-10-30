(() => {
    const counter = document.querySelector('.visitor-counter');
    if (!counter) return;

    const number = counter.querySelector('.visitor-number');
    const storageKey = 'ugurtepe-visit-number-v1';
    const endpoint = 'https://counterapi.com/api/ugurtepe.de/view/site-visits';
    const productionHosts = ['ugurtepe.de', 'www.ugurtepe.de', 'ugurtepe.github.io'];

    function showVisit(value) {
        number.textContent = `#${value}`;
    }

    function validVisit(value) {
        return Number.isSafeInteger(value) && value > 0;
    }

    // Keep local previews from contributing to the public counter.
    if (!productionHosts.includes(window.location.hostname)) {
        number.textContent = '#\u2014';
        counter.title = 'Visitor counter preview; local visits are not counted.';
        return;
    }

    try {
        const savedVisit = Number(window.sessionStorage.getItem(storageKey));
        if (validVisit(savedVisit)) {
            showVisit(savedVisit);
            return;
        }
    } catch {
        // Counting still works when browser storage is unavailable.
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
            try {
                window.sessionStorage.setItem(storageKey, String(result.value));
            } catch {
                // The number remains visible even if storage is blocked.
            }
        } catch {
            number.textContent = '#\u2014';
            counter.title = 'Visitor counter unavailable';
        } finally {
            window.clearTimeout(timeout);
        }
    }

    countVisit();
})();
