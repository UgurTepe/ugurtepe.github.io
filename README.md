# Uğur Tepe's Personal Website

[ugurtepe.de](https://ugurtepe.de/)

- `docs/`: current website.
- `docs/js/`: site JavaScript, including the cat, footer link and clock, contact validation, email copying, and MathJax configuration.
- `old design/`: previous design and backups.

Navigation icons are from [Pixelarticons](https://github.com/halfmage/pixelarticons) by Gerrit Halfmann. The original SVGs, MIT license, and source revision are in `docs/icons/pixelarticons/`.

The footer clock uses `Europe/Berlin` time, including automatic summer-time changes, and updates once per second.

The footer visitor box uses the public [CounterAPI.com API](https://counterapi.com/) and shares one counter across all four pages. `docs/js/visitor-counter.js` increments it once per browser tab session and keeps that visit number in `sessionStorage`, so refreshes and navigation retain the same number. This is an approximate visit count starting when the feature goes live, not a count of unique people or historical traffic. If browser storage is blocked, repeat page loads can count again. Local previews do not send counter requests. The counter sits immediately to the right of the clock with matching typography and colors, labeled "Visitor #" followed by the visit number. A failed request displays "Visitor #—" with a "Visitor counter unavailable" tooltip rather than a fabricated number. No API key or account is needed according to the provider's documentation; live availability must be checked from the hosted site.

The contact form on `docs/aboutme.html` uses [FormSubmit](https://formsubmit.co/) to send messages to `ugur.tepe@hhu.de`. After the first submission from the hosted website, confirm the activation email from FormSubmit (check spam if needed). Submissions use FormSubmit's default CAPTCHA and thank-you page, with a honeypot for additional spam filtering. The sender's email is used as the reply address.
