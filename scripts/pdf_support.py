"""Small PDF operations shared by the export and public-package checks."""

from io import BytesIO
from pathlib import Path
from typing import BinaryIO, Iterable

from pypdf import PageObject, PdfReader, PdfWriter
from pypdf.annotations import Link

PdfSource = str | Path | bytes | BinaryIO | PdfReader


def read_pdf(source: PdfSource) -> PdfReader:
    """Read a path, PDF bytes or binary stream, or reuse an existing reader."""
    if isinstance(source, PdfReader):
        return source
    return PdfReader(BytesIO(source) if isinstance(source, bytes) else source)


def page_texts(source: PdfSource) -> list[str]:
    """Return one searchable-text string per page, including empty pages."""
    return [page.extract_text() or "" for page in read_pdf(source).pages]


def _resolved(value):
    """Follow indirect references until a direct PDF object remains."""
    return value.get_object() if hasattr(value, "get_object") else value


def _link_annotations(page: PageObject) -> list:
    """Return the page's link annotations with indirect references resolved."""
    annotations = _resolved(page.get("/Annots")) or []
    links = []
    for reference in annotations:
        annotation = _resolved(reference)
        if hasattr(annotation, "get") and _resolved(annotation.get("/Subtype")) == "/Link":
            links.append(annotation)
    return links


def page_link_uris(page: PageObject) -> list[str]:
    """Return URI actions from a page's link annotations."""
    uris = []
    for annotation in _link_annotations(page):
        action = _resolved(annotation.get("/A"))
        if hasattr(action, "get") and _resolved(action.get("/S")) == "/URI" and action.get("/URI"):
            uris.append(str(_resolved(action["/URI"])))
    return uris


def page_link_values(page: PageObject) -> list[str]:
    """Return every string, name and number inside the page's link annotations.

    This covers URI, launch, remote-file and named-destination targets, so a
    privacy check sees file paths as well as web addresses. Back references to
    the page (/P, /Parent) are skipped.
    """
    values, seen = [], set()

    def collect(value):
        if hasattr(value, "idnum"):
            key = (value.idnum, value.generation)
            if key in seen:
                return
            seen.add(key)
        value = _resolved(value)
        if hasattr(value, "items"):
            for key, item in value.items():
                if key not in ("/P", "/Parent"):
                    collect(item)
        elif isinstance(value, list):
            for item in value:
                collect(item)
        elif isinstance(value, bytes):
            values.append(value.decode("latin-1"))
        else:
            values.append(str(value))

    for annotation in _link_annotations(page):
        collect(annotation)
    return values


def metadata(source: PdfSource) -> dict[str, str]:
    """Return PDF document information as plain strings with slash-prefixed keys."""
    info = read_pdf(source).metadata or {}
    return {str(key): _text(info[key]) for key in info}


def _text(value) -> str:
    """Turn a resolved PDF value into plain text; raw byte strings are decoded as Latin-1."""
    return value.decode("latin-1") if isinstance(value, bytes) else str(value)


def single_page_text(data: bytes) -> str:
    """Extract text from a one-page PDF; reject any other page count."""
    texts = page_texts(data)
    assert len(texts) == 1, f"Expected one PDF page, got {len(texts)}"
    return texts[0]


def merge_pages(pdf_bytes_list: Iterable[bytes]) -> PdfWriter:
    """Merge PDFs in order, preserving link annotations but not source outlines."""
    writer = PdfWriter()
    for data in pdf_bytes_list:
        writer.append(BytesIO(data), import_outline=False)
    return writer


def add_uri_link(writer: PdfWriter, index: int, uri: str) -> None:
    """Cover the entire page's media box with a URI link (zero-based index)."""
    writer.add_annotation(index, Link(rect=tuple(writer.pages[index].mediabox), url=uri))


def set_outline(writer: PdfWriter, items: Iterable[tuple[str, int]]) -> None:
    """Replace the outline with flat titles and zero-based page indexes."""
    writer.root_object.pop("/Outlines", None)
    for title, page_index in items:
        writer.add_outline_item(title=title, page_number=page_index)


def set_metadata(writer: PdfWriter, title: str, author: str, subject: str) -> None:
    """Set the exported document's title, author and subject."""
    writer.add_metadata({"/Title": title, "/Author": author, "/Subject": subject})


def save_compressed(writer: PdfWriter, path: str | Path) -> None:
    """Deduplicate objects, discard unreachable objects and compress page streams."""
    writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
    for page in writer.pages:
        page.compress_content_streams()
    writer.write(path)
