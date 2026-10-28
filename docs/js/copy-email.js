(() => {
    const buttons = document.querySelectorAll('.copy-email[data-email]');
    if (!buttons.length) return;

    const status = document.createElement('span');
    status.className = 'email-copy-status';
    status.setAttribute('role', 'status');
    document.body.appendChild(status);
    let statusTimer;

    buttons.forEach((button) => button.addEventListener('click', async () => {
        const email = button.dataset.email;
        let copied = false;
        window.clearTimeout(statusTimer);
        status.textContent = '';

        try {
            await navigator.clipboard.writeText(email);
            copied = true;
        } catch {
            // Some embedded previews restrict the Clipboard API.
            const field = document.createElement('textarea');
            field.value = email;
            field.setAttribute('readonly', '');
            field.setAttribute('aria-hidden', 'true');
            field.tabIndex = -1;
            field.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none;font-size:16px;';
            document.body.appendChild(field);
            field.focus({ preventScroll: true });
            field.select();

            try {
                copied = document.execCommand('copy');
            } catch {
                copied = false;
            } finally {
                field.remove();
                button.focus({ preventScroll: true });
            }
        }

        status.textContent = copied ? 'Copied!' : `Select and copy: ${email}`;
        if (!copied) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStart(status.firstChild, 'Select and copy: '.length);
            range.setEnd(status.firstChild, status.textContent.length);
            selection?.removeAllRanges();
            selection?.addRange(range);
        }
        statusTimer = window.setTimeout(() => { status.textContent = ''; }, copied ? 2500 : 8000);
    }));
})();
