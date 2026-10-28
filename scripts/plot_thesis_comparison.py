"""Render the two supplied TikZ panels as matching, web-ready scientific plots.

Run with Python, Matplotlib, and NumPy installed:
    python3 scripts/plot_thesis_comparison.py

The original TikZ source is retained in data/thesis_comparison.tikz. All plotted
coordinates are read from that source; no samples or fitted curves are invented.
"""

from pathlib import Path
import os
import re
import tempfile

os.environ.setdefault("MPLCONFIGDIR", str(Path(tempfile.gettempdir()) / "ugurtepe-matplotlib"))

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import LogLocator, NullFormatter
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(__file__).with_name("data") / "thesis_comparison.tikz"
OUTPUT = ROOT / "docs" / "images"

plt.rcParams.update({
    "font.family": "serif",
    "font.serif": ["STIXGeneral"],
    "mathtext.fontset": "stix",
    "font.size": 12,
    "axes.labelsize": 14,
    "axes.linewidth": 0.7,
    "legend.fontsize": 11,
    "xtick.labelsize": 11,
    "ytick.labelsize": 11,
    "svg.hashsalt": "ugurtepe-thesis",
    "savefig.facecolor": "white",
})


def make_axes():
    fig, ax = plt.subplots(figsize=(5.59, 4.09))
    # Matching margins and dimensions keep the two panels aligned on the page.
    fig.subplots_adjust(left=0.16, right=0.97, bottom=0.20, top=0.96)
    ax.set_axisbelow(True)
    ax.grid(which="major", color="#b0b0b0", linewidth=0.65, alpha=0.7)
    ax.tick_params(which="both", direction="out", top=False, right=False)
    ax.spines[["top", "right"]].set_visible(False)
    ax.set_yscale("log")
    ax.yaxis.set_minor_formatter(NullFormatter())
    return fig, ax


def save(fig, name):
    fig.savefig(OUTPUT / f"{name}.svg", metadata={"Date": None})
    fig.savefig(OUTPUT / f"{name}.png", dpi=200)
    plt.close(fig)


def accuracy_plot(source):
    tables = re.findall(
        r"\\addplot\s*\[[^]]+\]\s*table\s*\{\s*%?\s*(.*?)\};", source, re.S
    )
    ebs, fit, hoeffding_points, hoeffding_curve, bernstein = [
        np.array([[float(v) for v in row.split()] for row in table.splitlines()])
        for table in tables
    ]
    fig, ax = make_axes()
    ax.set_xscale("log")
    ax.set_xlim(1e6, 1e11)
    ax.set_ylim(1e-4, 0.2)
    ax.xaxis.set_major_locator(LogLocator(base=10, numticks=6))
    ax.set_xlabel(r"Total measurement rounds $N$")
    ax.set_ylabel(r"Accuracy $\epsilon$ [Ha]")
    ax.axhspan(1e-4, 0.0016, color="#808080", alpha=0.20, linewidth=0)
    green, red = "#6c951d", "#c53832"
    ax.plot(*ebs.T, linestyle="none", marker="*", markersize=8, color=green,
            label=r"EBS: $c = 0.68 \pm 0.02$", zorder=4)
    ax.plot(*fit.T, linestyle="--", linewidth=1.4, color=green)
    ax.plot(*hoeffding_points.T, linestyle="none", marker="o", markersize=3,
            color=red, zorder=3)
    ax.plot(*hoeffding_curve.T, linewidth=1.4, color=red,
            label=r"Hoeffding: $c = 0.5$")
    ax.plot(*bernstein.T, linestyle="--", linewidth=1.3, color="#222222",
            label="Bernstein bound")
    ax.legend(loc="upper right", framealpha=0.94, fancybox=False,
              edgecolor="#cccccc", borderpad=0.45, handlelength=1.8)
    ax.text(0.04, 0.09, r"$\epsilon(N) = A/N^c$", transform=ax.transAxes,
            fontsize=15, bbox={"facecolor": "white", "edgecolor": "#cccccc", "pad": 5})
    save(fig, "ebs_accuracy_scaling")


def molecule_plot(source):
    bars = re.findall(
        r"\\draw\[draw=gray,fill=([^]]+)\]\s*"
        r"\(axis cs:([^,]+),0\) rectangle \(axis cs:([^,]+),([^\)]+)\)", source
    )
    groups = {}
    for color, left, right, value in bars:
        groups.setdefault(color, []).append((float(left), float(right), float(value)))

    fig, ax = make_axes()
    ax.set_xlim(-0.69, 5.69)
    ax.set_ylim(788274.920369892, 19138579329.5849)
    ax.set_yticks([1e6, 1e7, 1e8, 1e9, 1e10])
    ax.set_ylabel(r"Measurement rounds $N$")
    molecules = [r"$\mathrm{H_2}$", r"$\mathrm{H_2}$", r"$\mathrm{LiH}$",
                 r"$\mathrm{BeH_2}$", r"$\mathrm{H_2O}$", r"$\mathrm{NH_3}$"]
    qubits = [4, 8, 12, 14, 14, 16]
    ax.set_xticks(range(6), [f"{m}\n$n={n}$" for m, n in zip(molecules, qubits)])
    ax.tick_params(axis="x", labelsize=11, pad=6)

    styles = [
        ("orange2551660", "Jordan–Wigner", "#ffa600"),
        ("tomato2559997", "Bravyi–Kitaev", "#ff6361"),
        ("palevioletred18880144", "Parity", "#bc5090"),
        ("midnightblue06392", "Hoeffding", "#003f5c"),
    ]
    for key, label, color in styles:
        values = groups[key]
        assert len(values) == 6, f"Expected six molecule values for {label}"
        left, right, heights = np.array(values).T
        # Starting below the visible log range preserves every supplied bar top.
        ax.bar((left + right) / 2, heights - 1, width=right - left, bottom=1,
               color=color, edgecolor="#666666", linewidth=0.45, label=label)
    ax.legend(loc="upper left", ncols=2, fontsize=10, framealpha=0.94,
              fancybox=False, edgecolor="#cccccc", borderpad=0.45,
              columnspacing=1, handlelength=1.1, handletextpad=0.45)
    save(fig, "ebs_molecule_comparison")


if __name__ == "__main__":
    source = SOURCE.read_text()
    accuracy_plot(source)
    molecule_plot(source)
    print(f"Rendered SVG and PNG figures in {OUTPUT}")
