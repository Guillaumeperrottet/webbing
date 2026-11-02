"""Build Latin WOFF2 subsets without changing outlines, hinting or text metrics.

Requires fonttools[woff]. Run from anywhere with:
    python scripts/subset-display-fonts.py

The full original files remain available for other scripts and Open Graph output.
"""

import json
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / "public" / "fonts"
OUTPUT = FONTS / "subsets"
RANGES = (
    (0x0000, 0x024F),
    (0x0300, 0x036F),
    (0x1E00, 0x1EFF),
    (0x2000, 0x206F),
    (0x20A0, 0x20CF),
    (0x2100, 0x214F),
    (0x2190, 0x22FF),
    (0x25A0, 0x25FF),
    (0xFEFF, 0xFEFF),
    (0xFFFD, 0xFFFD),
)
UNICODES = {code for start, end in RANGES for code in range(start, end + 1)}


def metrics(font):
    return {
        table: {key: getattr(font[table], key) for key in keys}
        for table, keys in {
            "head": ("unitsPerEm",),
            "hhea": ("ascent", "descent", "lineGap"),
            "OS/2": ("sTypoAscender", "sTypoDescender", "sTypoLineGap"),
        }.items()
    }


def main():
    OUTPUT.mkdir(exist_ok=True)
    records = []
    for weight in ("Regular", "Medium", "Bold", "Black"):
        source = FONTS / f"SF-Pro-Display-{weight}.woff2"
        target = OUTPUT / f"SF-Pro-Display-{weight}-latin.woff2"
        with TTFont(source, recalcTimestamp=False) as font:
            cmap = font.getBestCmap()
            expected = {
                code: font["hmtx"][glyph]
                for code, glyph in cmap.items()
                if code in UNICODES
            }
            original_metrics = metrics(font)
            original_tracking = font.getTableData("trak") if "trak" in font else None
            options = subset.Options()
            options.layout_features = ["*"]
            options.name_IDs = ["*"]
            options.name_legacy = True
            options.name_languages = ["*"]
            options.notdef_outline = True
            options.recalc_timestamp = False
            # Apple's tracking and language metadata don't reference glyph IDs.
            options.no_subset_tables += ["trak", "meta"]
            subsetter = subset.Subsetter(options=options)
            subsetter.populate(unicodes=UNICODES)
            subsetter.subset(font)
            font.flavor = "woff2"
            font.save(target)
        with TTFont(target) as result:
            assert metrics(result) == original_metrics
            if original_tracking is not None:
                assert result.getTableData("trak") == original_tracking
            actual = result.getBestCmap()
            for code, width in expected.items():
                assert code in actual, f"Missing U+{code:04X} in {weight}"
                assert result["hmtx"][actual[code]] == width
        records.append({
            "weight": weight,
            "source_bytes": source.stat().st_size,
            "subset_bytes": target.stat().st_size,
            "retained_characters": len(expected),
            "metrics": "unchanged",
        })
    print(json.dumps(records, indent=2))


if __name__ == "__main__":
    main()
