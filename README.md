# Uğur Tepe's Personal Website

[ugurtepe.de](https://ugurtepe.de/)

- `docs/`: current website.
- `docs/js/`: site JavaScript, including the cat, footer link and clock, contact validation, email copying, and MathJax configuration.
- `old design/`: previous design and backups.

Navigation icons are from [Pixelarticons](https://github.com/halfmage/pixelarticons) by Gerrit Halfmann. The original SVGs, MIT license, and source revision are in `docs/icons/pixelarticons/`.

The footer clock uses `Europe/Berlin` time, including automatic summer-time changes, and updates once per second.

The contact form on `docs/aboutme.html` uses [FormSubmit](https://formsubmit.co/) to send messages to `ugur.tepe@hhu.de`. After the first submission from the hosted website, confirm the activation email from FormSubmit (check spam if needed). Submissions use FormSubmit's default CAPTCHA and thank-you page, with a honeypot for additional spam filtering. The sender's email is used as the reply address.
