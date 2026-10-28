(() => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = [...form.querySelectorAll('.form-field input, .form-field textarea')];
    const requiredMessages = {
        name: 'Please enter your name.',
        email: 'Please enter your email address.',
        message: 'Please enter a message.'
    };

    function showValidation(field) {
        const error = document.getElementById(`${field.id}-error`);
        const validity = field.validity;

        if (validity.valid) {
            field.removeAttribute('aria-invalid');
            error.textContent = '';
            error.hidden = true;
            return;
        }

        field.setAttribute('aria-invalid', 'true');
        error.textContent = validity.valueMissing
            ? requiredMessages[field.name]
            : validity.typeMismatch && field.type === 'email'
                ? 'Please enter an email address like name@example.com.'
                : field.validationMessage;
        error.hidden = false;
    }

    form.addEventListener('submit', (event) => {
        fields.forEach(showValidation);
        const firstInvalid = fields.find((field) => !field.validity.valid);
        if (firstInvalid) {
            event.preventDefault();
            firstInvalid.focus();
        }
    });

    fields.forEach((field) => {
        field.addEventListener('input', () => {
            if (field.hasAttribute('aria-invalid')) showValidation(field);
        });
    });

    // Keep native browser validation when this script is unavailable.
    form.noValidate = true;
})();
