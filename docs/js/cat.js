(() => {
    document.querySelectorAll('.cat-interaction').forEach((cat) => {
        function measure() {
            if (cat.classList.contains('is-measured')) return;

            cat.classList.add('is-measured', 'has-measured');
            window.setTimeout(() => {
                // With alive = |0> and dead = |1>, U = HX prepares |+>.
                // Apply X first: H alone would prepare the minus state from |dead>.
                cat.classList.add('is-resetting', 'is-applying-x');
                window.setTimeout(() => {
                    cat.classList.remove('is-applying-x');
                    cat.classList.add('is-applying-h');
                    window.setTimeout(() => {
                        cat.classList.remove('is-measured', 'is-resetting', 'is-applying-h');
                    }, 1500);
                }, 1500);
            }, 10000);
        }

        cat.addEventListener('pointerenter', measure);
        cat.addEventListener('focus', measure);
        cat.addEventListener('click', measure);
    });
})();
