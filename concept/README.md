# Design preview

This folder retains the design preview used for the redesign. The active GitHub Pages website is now in `../docs/`; make future published changes there. The previous design is preserved in `../old design/`.

Open `index.html` in your browser to view this preview. All four pages, images, and PDFs are included in this folder.

For a local HTTP preview, run this from the repository root:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory concept
```

Then visit http://127.0.0.1:4173. Press Ctrl+C to stop the server.

The concept keeps the site's single-column structure, existing content, separate pages, and original cat. The retro palette borrows the original site's cream text, vivid magenta links, and orange PDF links, with bright amber accents and charcoal button surfaces on black. The author's name has a separate green highlight. Navigation shows icons and text on a transparent background, with the current page's text underlined. All buttons share a brighter background, white text, and a white border on hover. Main text, headings, and buttons share PT Serif from the original site, loaded through Google Fonts with Georgia, Times New Roman, Times, and serif fallbacks. Section headings use bold lettering and a plain cream-colored rule matching the text width. The background uses the original static starfield texture at a slightly larger tile size for about 20% fewer small stars, with a sparse scattering of extra white points, compact orange gradient halos, and a few blue and purple stars drawn in CSS. Faint blue-purple nebula wisps sit near the upper-left and lower-right edges. The colored star highlights are softened through the main reading area.

At widths of 720px and below, navigation switches to two columns so all four links remain visible without horizontal scrolling. Buttons keep their 46px minimum height, and labels can wrap when needed.

Links & Contact places Email, GitHub, and LinkedIn in three equally sized columns, stacked vertically at widths of 720px and below. Each entry uses an original local icon, a small heading, and the email address or linked profile name. Clicking the email address copies it and shows a short confirmation; the profile links open GitHub and LinkedIn. There are no separate action buttons. The email address is a keyboard-accessible button styled like the other text links, with a clipboard fallback for embedded previews.

The home page opens with "Uğur Tepe's Personal Website". Page introductions use plain headings, with compact section spacing and a smaller main heading. Each footer contains only "Ugur Tepes personal website".

Publication titles link directly to the journal, followed by smaller citation details. Text uses the available content width and wraps naturally on smaller screens. PDF links show their file sizes.

Research interests have large, abstract CSS symbols: three smoothly braided strands for topological quantum computing, a simplified Bloch sphere with a level equator and state arrow for quantum information, and a compact 3-by-3 cell lattice with straight columns, inward-bending middle rows, and nodes at each intersection for condensed matter. The lattice's outer rows are 48px apart, with thin 1px connecting lines. There are no electron markers. Neutral cream outlines use a shared nebula-rose accent (`#e88991`) only on the long strand that crosses both others, the state arrow, and the lattice nodes. Each symbol is 72px square, drawn with CSS borders, clipping paths, and shadows, with no image assets or scripts. The drawings are decorative; the research labels remain accessible text.

The cat displays the normalized state `|psi> = (|alive> + |dead>) / sqrt(2)`. Hovering or focusing the cat changes both its image and equation to the measured dead state. The equation uses native MathML and works locally without a script or external math service.

There is no build step or hosting configuration. The thesis equations use consistent LaTeX delimiters and retain the original site's MathJax dependency. Those equations and Prism code highlighting need an internet connection. The cat equations, styling, background, and navigation icons are local.
