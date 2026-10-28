(() => {
    const button = document.querySelector('.back-to-top');
    if (!button) return;

    function updateVisibility() {
        const page = document.documentElement;
        const distanceFromBottom = page.scrollHeight - window.innerHeight - window.scrollY;
        button.hidden = window.scrollY <= 0 || distanceFromBottom > 8;
    }

    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    window.addEventListener('load', updateVisibility);
    new ResizeObserver(updateVisibility).observe(document.body);
    updateVisibility();
})();
