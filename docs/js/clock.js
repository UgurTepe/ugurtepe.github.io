(() => {
    const clock = document.querySelector('.footer-clock');
    if (!clock) return;

    const date = clock.querySelector('.clock-date');
    const time = clock.querySelector('.clock-time');
    const dateFormat = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    const timeFormat = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin',
        hourCycle: 'h23',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });

    function updateClock() {
        const now = new Date();
        const parts = Object.fromEntries(dateFormat.formatToParts(now).map((part) => [part.type, part.value]));
        date.textContent = `${parts.weekday} ${parts.day} ${parts.month} ${parts.year}`;
        time.textContent = timeFormat.format(now);
        clock.dateTime = now.toISOString();
    }

    updateClock();
    window.setInterval(updateClock, 1000);
    document.addEventListener('visibilitychange', updateClock);
})();
