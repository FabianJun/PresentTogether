# Decisions

## 2026-11-17: PDF dependency replacement

The owner approved replacing PyMuPDF with pypdf or pdfplumber. pypdf was chosen because it covers every operation the scripts need.

pypdf covers text, URI links, metadata, outlines, merging and compressed saves. It uses the BSD-3-Clause licence, is pure Python and has no required dependencies. pdfplumber is intended for layout extraction and would add pdfminer.six and pypdfium2.

## 2026-11-17: Local speaker previews

The two local PNG previews per speaker now come from the first and last HTML `section.page` elements through Playwright. pypdf does not render pages to images; the preview filenames are retained. The previews show the HTML as rendered on screen, not the printed PDF, so open the exported PDF itself to check its look.

## 2026-11-17: Export verification boundary

Committed exports were not regenerated in this package, so their `/Producer` metadata stays as it is until the next export. The full browser export run is **unchecked** until the next local export or CI run. PDF helper unit tests use the committed presentation and synthetic PDFs; see [development commands](DEVELOPMENT.md).

## 2026-11-17: Link coverage of the public-package check

The public-package check inspects every value inside each PDF link annotation: web addresses, launch and remote-file targets, and named destinations, with indirect references resolved. Document information is read as plain strings and inspected without JSON escaping, so Windows paths with backslashes match the private-path rule. Unit tests cover a local file target, a remote-file target, a named destination, indirect values and a backslash path in the author field.
