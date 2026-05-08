#!/usr/bin/env python3
"""
Rearrange a PDF for cut-stack booklet assembly.

It places two portrait pages onto one landscape page:
sheet 1: [1, half+1]
sheet 2: [2, half+2]
...

Example with 5 input pages:
sheet 1 -> [1, 4]
sheet 2 -> [2, 5]
sheet 3 -> [3, blank]
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

from pypdf import PageObject, PdfReader, PdfWriter, Transformation


def mm_to_pt(value_mm: float) -> float:
    return value_mm * 72.0 / 25.4


def build_sheet_pairs(total_pages: int, mode: str) -> list[tuple[int, int | None]]:
    if total_pages <= 0:
        raise ValueError("Input PDF has no pages.")
    if mode not in {"split_stack", "reverse_right"}:
        raise ValueError(f"Unsupported mode: {mode}")

    half = math.ceil(total_pages / 2)
    pairs: list[tuple[int, int | None]] = []

    for i in range(half):
        left_index = i
        if mode == "split_stack":
            right_index = i + half
        else:
            right_index = total_pages - 1 - i

        right_page: int | None = None
        if right_index < total_pages and right_index > left_index:
            right_page = right_index + 1

        pairs.append((left_index + 1, right_page))

    return pairs


def create_cutstack_pdf(
    input_path: Path,
    output_path: Path,
    mode: str = "split_stack",
    margin_mm: float = 0.0,
    gap_mm: float = 0.0,
    fit_mode: str = "contain",
    swap_sides: bool = False,
) -> None:
    reader = PdfReader(str(input_path))
    writer = PdfWriter()

    total_pages = len(reader.pages)
    pairs = build_sheet_pairs(total_pages, mode)
    if fit_mode not in {"contain", "original"}:
        raise ValueError(f"Unsupported fit mode: {fit_mode}")

    margin_pt = mm_to_pt(max(0.0, margin_mm))
    gap_pt = mm_to_pt(max(0.0, gap_mm))

    for left_page_num, right_page_num in pairs:
        left_page = reader.pages[left_page_num - 1]
        right_page = reader.pages[right_page_num - 1] if right_page_num is not None else None

        page_width = float(left_page.mediabox.width)
        page_height = float(left_page.mediabox.height)

        # Build one landscape sheet from two portrait slots.
        sheet_width = page_width * 2
        sheet_height = page_height
        sheet = PageObject.create_blank_page(
            width=sheet_width,
            height=sheet_height,
        )

        available_total_width = sheet_width - (2 * margin_pt) - gap_pt
        slot_width = available_total_width / 2
        slot_height = sheet_height - (2 * margin_pt)
        if slot_width <= 0 or slot_height <= 0:
            raise ValueError("Margins/gap too large for page size.")

        def place_page(page, slot_x_start: float) -> None:
            page_w = float(page.mediabox.width)
            page_h = float(page.mediabox.height)
            if fit_mode == "contain":
                scale = min(slot_width / page_w, slot_height / page_h)
            else:
                scale = 1.0

            draw_w = page_w * scale
            draw_h = page_h * scale
            draw_x = slot_x_start + (slot_width - draw_w) / 2
            draw_y = margin_pt + (slot_height - draw_h) / 2

            sheet.merge_transformed_page(
                page,
                Transformation().scale(sx=scale, sy=scale).translate(tx=draw_x, ty=draw_y),
            )

        left_slot_x = margin_pt
        right_slot_x = margin_pt + slot_width + gap_pt
        if swap_sides:
            left_slot_x, right_slot_x = right_slot_x, left_slot_x

        place_page(left_page, left_slot_x)

        if right_page is not None:
            place_page(right_page, right_slot_x)

        writer.add_page(sheet)

    with output_path.open("wb") as f:
        writer.write(f)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Arrange PDF pages as cut-stack 2-up landscape sheets.",
    )
    parser.add_argument("input_pdf", type=Path, help="Input PDF path.")
    parser.add_argument("output_pdf", type=Path, help="Output PDF path.")
    parser.add_argument(
        "--mode",
        choices=["split_stack", "reverse_right"],
        default="split_stack",
        help="Page pairing mode (default: split_stack).",
    )
    parser.add_argument("--margin-mm", type=float, default=0.0, help="Outer margins in mm.")
    parser.add_argument("--gap-mm", type=float, default=0.0, help="Gap between left/right slots in mm.")
    parser.add_argument(
        "--fit-mode",
        choices=["contain", "original"],
        default="contain",
        help="Scale pages to fit slot (contain) or keep original size.",
    )
    parser.add_argument(
        "--swap-sides",
        action="store_true",
        help="Swap left/right slot placement on each sheet.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.input_pdf.exists():
        raise SystemExit(
            f"Input file not found: {args.input_pdf}\n"
            "Use a real PDF path, for example:\n"
            "  python3 rearrange_cutstack.py mybook.pdf mybook-cutstack.pdf"
        )
    if args.input_pdf.suffix.lower() != ".pdf":
        raise SystemExit(f"Input must be a PDF file: {args.input_pdf}")

    create_cutstack_pdf(
        args.input_pdf,
        args.output_pdf,
        mode=args.mode,
        margin_mm=args.margin_mm,
        gap_mm=args.gap_mm,
        fit_mode=args.fit_mode,
        swap_sides=args.swap_sides,
    )
    print(f"Created: {args.output_pdf}")


if __name__ == "__main__":
    main()
