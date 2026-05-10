# PDF Cut-Stack Rearranger

This tool rearranges pages so you can print 2-up (portrait pages on one landscape sheet), cut the stack, and place one half over the other in correct reading order.

For `N` pages:
- `half = ceil(N/2)`
- sheet 1 = `[1, 1+half]`
- sheet 2 = `[2, 2+half]`
- ...
- missing right page becomes blank

Example (`N=5`):
- sheet 1: `[1,4]`
- sheet 2: `[2,5]`
- sheet 3: `[3,blank]`

## Install

```bash
python3 -m pip install pypdf flask
```

## Usage

```bash
python3 rearrange_cutstack.py input.pdf output.pdf
```

Extended CLI options:

```bash
python3 rearrange_cutstack.py input.pdf output.pdf \
  --mode split_stack \
  --fit-mode contain \
  --margin-mm 4 \
  --gap-mm 2
```

Available format options:
- `--mode split_stack|reverse_right` page pairing strategy
- `--fit-mode contain|original` scale pages to slot or keep original size
- `--margin-mm` outer page margins in millimeters
- `--gap-mm` center gap between left/right slots in millimeters
- `--swap-sides` swap left/right placement per sheet

## Web Interface (Drag & Drop)

Start local web app:

```bash
python3 app.py
```

Then open:

`http://127.0.0.1:5050`

If the port is already in use, choose another one:

```bash
python3 app.py --port 5051
```

Use drag and drop to upload a PDF and the converted file downloads automatically.

Modes in web UI:
- `Split-Stack`: `[1, half+1], [2, half+2], ...` (your original requested logic)
- `Reverse-Right`: `[1, N], [2, N-1], ...` (sometimes needed for different stack habits)

Recommended starting preset:
- Mode: `Split-Stack`
- Scaling: `Einpassen (contain)`
- Margin: `4 mm`
- Gap: `2 mm`

<a href="https://pdf2booklet.com">pdf2booklet.com</a>
