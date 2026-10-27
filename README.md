# Uğur Tepe's Personal Website

Live site: https://ugurtepe.github.io/

- `docs/` contains the active website published by GitHub Pages from `main`.
- `old design/` preserves the previous published design. Its `local before publish/` subfolder also keeps the local changes that existed before the redesign was promoted.
- `concept/` retains the design preview used during the redesign. Make future website changes in `docs/`.

## Local preview

From the repository root, run:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory docs
```

Open http://127.0.0.1:4173. Press Ctrl+C to stop the server.
