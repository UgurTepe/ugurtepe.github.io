"""Render the site's vector-style cat mark and social card (requires Pillow)."""

from pathlib import Path
import math
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


def cat(draw, x, y, size, width):
    # Simple, deliberately bold geometry stays recognizable at favicon sizes.
    outline = [(11, 28), (10, 8), (25, 18), (39, 18), (54, 8), (53, 28)]
    outline += [
        (32 + 23 * math.cos(t), 32 + 23 * math.sin(t))
        for t in [i * math.pi / 60 for i in range(0, 61)]
    ]
    outline += [(11, 28)]
    scale = size / 64
    points = [(x + a * scale, y + b * scale) for a, b in outline]
    draw.line(points, fill=CREAM, width=width, joint="curve")
    for a in [23, 41]:
        draw.ellipse(
            (x + (a - 2) * scale, y + 30 * scale,
             x + (a + 2) * scale, y + 34 * scale), fill=CREAM
        )
    draw.polygon(
        [(x + a * scale, y + b * scale) for a, b in [(29, 39), (35, 39), (32, 43)]],
        fill="#e700fc",
    )


def main():
    ASSETS.mkdir(exist_ok=True)
    icon = Image.new("RGB", (256, 256), "#08080c")
    cat(ImageDraw.Draw(icon), 0, 0, 256, 13)
    icon.resize((64, 64), Image.Resampling.LANCZOS).save(ASSETS / "favicon.png")
    icon.save(ROOT / "docs" / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

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

    # The same cat mark links the browser tab and shared-link preview.
    draw.ellipse((825 * scale, 166 * scale, 1115 * scale, 456 * scale),
                 outline="#38352f", width=scale)
    cat(draw, 842 * scale, 186 * scale, 256 * scale, 7 * scale)
    for x, y, color in [(1075, 163, "#e700fc"), (850, 440, "#f4c452")]:
        draw.ellipse(((x - 5) * scale, (y - 5) * scale,
                      (x + 5) * scale, (y + 5) * scale), fill=color)

    colors = ["#ff65d5", "#7896ff", "#52d5ff", "#b5e379", "#ffe16a", "#ff9b4b"]
    for i, color in enumerate(colors):
        draw.rectangle((i * 200 * scale, 606 * scale,
                        (i + 1) * 200 * scale, 609 * scale), fill=color)
    card.resize((1200, 630), Image.Resampling.LANCZOS).save(ASSETS / "social-preview.png")
    print("Generated favicon.png, favicon.ico, and social-preview.png (1200 × 630).")


if __name__ == "__main__":
    main()
