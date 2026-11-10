# Uğur Tepe's Personal Website

[ugurtepe.de](https://ugurtepe.de/) — a static physics homepage with an old-school design.

- `docs/`: website pages, styles, scripts, and assets.
- `old design/`: previous designs and backups.

Page views use [Abacus](https://github.com/JasonLovesDoggo/abacus); the footer total updates live through its stream endpoint while the page is visible. The contact form uses [FormSubmit](https://formsubmit.co/); confirm its activation email after the first live submission.

Click the page-view counter to open `docs/downloads.html`, an unlisted, noindex page with sortable document download statistics. It counts clicks on local document links across the site, including opening a PDF; it cannot count earlier downloads, direct file visits, or completed transfers. Local previews never increment counters. The page is unlisted, not access-controlled.

After adding, renaming, or replacing a document in `docs/files/`, run `python3 scripts/generate_download_files.py` and commit the updated inventory and page. Each case-sensitive file path has its own stable Abacus counter, so replacing a file at the same path preserves its count. Statistics use read-only requests; unavailable counters display a dash and counters with no clicks display zero.

Navigation icons are from [Pixelarticons](https://github.com/halfmage/pixelarticons) by Gerrit Halfmann. License and source details are in `docs/icons/pixelarticons/`.
