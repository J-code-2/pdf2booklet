#!/usr/bin/env python3
from __future__ import annotations

import argparse
import tempfile
from pathlib import Path

from flask import Flask, jsonify, render_template, request, send_file
from werkzeug.utils import secure_filename

from rearrange_cutstack import build_sheet_pairs, create_cutstack_pdf

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 100 * 1024 * 1024  # 100 MB


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/api/rearrange")
def rearrange():
    uploaded = request.files.get("pdf")
    mode = request.form.get("mode", "split_stack")
    fit_mode = request.form.get("fit_mode", "contain")
    swap_sides = request.form.get("swap_sides", "false").lower() == "true"
    if uploaded is None or uploaded.filename == "":
        return jsonify({"error": "Bitte eine PDF-Datei auswählen."}), 400

    filename = secure_filename(uploaded.filename)
    if not filename.lower().endswith(".pdf"):
        return jsonify({"error": "Nur PDF-Dateien sind erlaubt."}), 400
    try:
        margin_mm = float(request.form.get("margin_mm", "0") or "0")
        gap_mm = float(request.form.get("gap_mm", "0") or "0")
    except ValueError:
        return jsonify({"error": "Rand/Abstand müssen Zahlen sein."}), 400

    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = Path(tmpdir)
        input_path = tmp_path / filename
        output_path = tmp_path / f"{Path(filename).stem}-cutstack.pdf"

        uploaded.save(input_path)
        try:
            create_cutstack_pdf(
                input_path,
                output_path,
                mode=mode,
                margin_mm=margin_mm,
                gap_mm=gap_mm,
                fit_mode=fit_mode,
                swap_sides=swap_sides,
            )
        except Exception:
            return jsonify({"error": "PDF konnte nicht verarbeitet werden."}), 400

        return send_file(
            output_path,
            as_attachment=True,
            download_name=output_path.name,
            mimetype="application/pdf",
        )


@app.post("/api/preview")
def preview():
    uploaded = request.files.get("pdf")
    mode = request.form.get("mode", "split_stack")
    if uploaded is None or uploaded.filename == "":
        return jsonify({"error": "Bitte eine PDF-Datei auswählen."}), 400

    filename = secure_filename(uploaded.filename)
    if not filename.lower().endswith(".pdf"):
        return jsonify({"error": "Nur PDF-Dateien sind erlaubt."}), 400

    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = Path(tmpdir)
        input_path = tmp_path / filename
        uploaded.save(input_path)

        try:
            from pypdf import PdfReader

            total_pages = len(PdfReader(str(input_path)).pages)
            pairs = build_sheet_pairs(total_pages, mode)
        except Exception:
            return jsonify({"error": "Vorschau konnte nicht erzeugt werden."}), 400

    blank_pages = sum(1 for _, right in pairs if right is None)
    return jsonify(
        {
            "total_pages": total_pages,
            "total_sheets": len(pairs),
            "blank_pages": blank_pages,
            "pairs": [
                {"sheet": idx + 1, "left": left, "right": right}
                for idx, (left, right) in enumerate(pairs)
            ],
        }
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run local PDF rearranger web app.")
    parser.add_argument(
        "--port",
        type=int,
        default=5050,
        help="Port for local web server (default: 5050).",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    app.run(debug=True, port=args.port)
