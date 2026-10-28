"""Render the site's PNG favicon and social card from favicon.ico (requires Pillow)."""

from pathlib import Path
import random

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "docs" / "images"
CREAM = "#fff8dc"
MUTED = "#c3bea5"


def font(size, bold=False):
    names = [
        f"C:/Windows/Fonts/georgia{'b' if bold else ''}.ttf",
        f"/usr/share/fonts/truetype/dejavu/DejaVuSerif{'-Bold' if bold else ''}.ttf",
        f"/System/Library/Fonts/Supplemental/Georgia{' Bold' if bold else ''}.ttf",
    ]
    for name in names:
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    raise FileNotFoundError("Install Georgia or DejaVu Serif to render the card.")


def main():
    # Pillow opens the largest available ICO size. Keep the source file untouched.
    with Image.open(ROOT / "docs" / "favicon.ico") as source:
        icon = source.convert("RGBA")
    ASSETS.mkdir(exist_ok=True)
    icon.resize((64, 64), Image.Resampling.LANCZOS).save(ASSETS / "favicon.png")

    # Work at twice the output resolution for clean lines and typography.
    scale = 2
    card = Image.new("RGB", (1200 * scale, 630 * scale), "#08080c")
    draw = ImageDraw.Draw(card)
    rng = random.Random(42)
    for _ in range(170):
        x, y = rng.randrange(1200), rng.randrange(630)
        radius = rng.choice([0.5, 0.6, 0.8, 1.2]) * scale
        draw.ellipse((x * scale - radius, y * scale - radius,
                      x * scale + radius, y * scale + radius),
                     fill=rng.choice(["#282832", "#353540", "#55525b"]))

    def text(x, y, value, size, fill=CREAM, bold=False):
        draw.text((x * scale, y * scale), value, font=font(size * scale, bold), fill=fill)

    text(76, 70, "PHYSICS · HHU DÜSSELDORF", 18, MUTED)
    text(70, 145, "Uğur Tepe", 76, bold=True)
    text(76, 284, "Condensed matter physics", 28)
    text(76, 332, "Topological quantum computing", 28)
    text(76, 380, "Quantum information", 28)
    text(76, 520, "ugurtepe.de", 22, MUTED)

    # Reuse the existing psi icon in the shared-link preview, preserving transparency.
    draw.ellipse((825 * scale, 166 * scale, 1115 * scale, 456 * scale),
                 outline="#38352f", width=scale)
    mark = icon.resize((256 * scale, 256 * scale), Image.Resampling.LANCZOS)
    card.paste(mark, (842 * scale, 186 * scale), mark)
    for x, y, color in [(1075, 163, "#e700fc"), (850, 440, "#f4c452")]:
        draw.ellipse(((x - 5) * scale, (y - 5) * scale,
                      (x + 5) * scale, (y + 5) * scale), fill=color)

    colors = ["#ff65d5", "#7896ff", "#52d5ff", "#b5e379", "#ffe16a", "#ff9b4b"]
    for i, color in enumerate(colors):
        draw.rectangle((i * 200 * scale, 606 * scale,
                        (i + 1) * 200 * scale, 609 * scale), fill=color)
    card.resize((1200, 630), Image.Resampling.LANCZOS).save(ASSETS / "social-preview.png")
    print("Generated favicon.png and social-preview.png (1200 × 630) from favicon.ico.")


if __name__ == "__main__":
    main()
