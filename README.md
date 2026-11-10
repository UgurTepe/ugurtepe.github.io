# Uğur Tepe's Personal Website

[ugurtepe.de](https://ugurtepe.de/) — a static physics homepage with an old-school design.

- `docs/`: website pages, styles, scripts, and assets.
- `old design/`: previous designs and backups.

Visitors are counted by [GoatCounter](https://www.goatcounter.com/) (site `ugurtepe46`, dashboard at <https://ugurtepe46.goatcounter.com>), loaded from `docs/js/goatcounter.js`. The footer shows the GoatCounter site total, which requires the "Allow adding visitor counts on your website" setting and is cached by GoatCounter for up to four hours; it shows a dash when GoatCounter is unavailable or blocked. The previous [Abacus](https://github.com/JasonLovesDoggo/abacus) page-view counter is kept as an unused backup in `docs/js/visitor-counter.js`; no page loads it, so Abacus no longer counts page views. Document link clicks are also sent to GoatCounter as `download-…` events. The contact form uses [FormSubmit](https://formsubmit.co/); confirm its activation email after the first live submission.

Click the footer counter to open `docs/downloads.html`, an unlisted, noindex page with sortable document download statistics. It counts clicks on local document links across the site, including opening a PDF; it cannot count earlier downloads, direct file visits, or completed transfers. Local previews never increment counters. The page is unlisted, not access-controlled.

After adding, renaming, or replacing a document in `docs/files/`, run `python3 scripts/generate_download_files.py` and commit the updated inventory and page. Each case-sensitive file path has its own stable Abacus counter, so replacing a file at the same path preserves its count. Statistics use read-only requests; unavailable counters display a dash and counters with no clicks display zero.

Navigation icons are from [Pixelarticons](https://github.com/halfmage/pixelarticons) by Gerrit Halfmann. License and source details are in `docs/icons/pixelarticons/`.
