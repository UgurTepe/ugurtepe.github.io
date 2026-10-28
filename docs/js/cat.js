(() => {
    document.querySelectorAll('.cat-interaction').forEach((cat) => {
        function measure() {
            if (cat.classList.contains('is-measured')) return;

            cat.classList.add('is-measured', 'has-measured');
            window.setTimeout(() => {
                cat.classList.remove('is-measured');
            }, 10000);
        }

        cat.addEventListener('pointerenter', measure);
        cat.addEventListener('focus', measure);
        cat.addEventListener('click', measure);
    });
})();
