"""Render the existing ket-psi vector on a theme-independent badge.

Requires Pillow and fonttools. Run from any directory with:
    python scripts/generate_favicon.py
"""

from pathlib import Path

from fontTools.pens.basePen import BasePen
from fontTools.svgLib import SVGPath
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]


class IconPen(BasePen):
    """Draw the source SVG's white filled paths and square-ended strokes."""

    def __init__(self, draw, scale):
        super().__init__(None)
        self.draw = draw
        self.scale = scale
        self.points = []

    def _moveTo(self, point):
        self.points = [point]

    def _lineTo(self, point):
        self.points.append(point)

    def _curveToOne(self, first, second, end):
        start = self._getCurrentPoint()
        for step in range(1, 33):
            t = step / 32
            self.points.append(tuple(
                (1 - t) ** 3 * start[i]
                + 3 * (1 - t) ** 2 * t * first[i]
                + 3 * (1 - t) * t ** 2 * second[i]
                + t ** 3 * end[i]
                for i in (0, 1)
            ))

    def _closePath(self):
        self.draw.polygon(self.points, fill="white")

    def _endPath(self):
        # The two open paths in ket-psi.svg use a seven-unit square stroke.
        width = round(7 * self.scale)
        self.draw.line(self.points, fill="white", width=width, joint="curve")
        half = width / 2
        for x, y in (self.points[0], self.points[-1]):
            self.draw.rectangle((x - half, y - half, x + half, y + half), fill="white")


def generate_favicon():
    # Supersample the vector and badge together for clean small-size edges.
    size = 1024
    icon = Image.new("RGBA", (size, size))
    draw = ImageDraw.Draw(icon)
    draw.rounded_rectangle(
        (4, 4, size - 5, size - 5), radius=192,
        fill="#111111", outline="#625f58", width=8,
    )
    scale = size / 128 * 0.88
    inset = size * 0.06
    SVGPath(
        ROOT / "scripts" / "data" / "ket-psi.svg",
        transform=(scale, 0, 0, scale, inset, inset),
    ).draw(IconPen(draw, scale))

    assets = ROOT / "docs" / "images"
    assets.mkdir(exist_ok=True)
    icon.resize((64, 64), Image.Resampling.LANCZOS).save(assets / "favicon.png")
    icon.save(ROOT / "docs" / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])


if __name__ == "__main__":
    generate_favicon()
    print("Generated favicon.png (64x64) and favicon.ico (16, 32, 48).")
