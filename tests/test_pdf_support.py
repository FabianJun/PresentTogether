"""Exercise PDF reading and writing without a browser or generated exports."""

import ast
from io import BytesIO
import json
import re
from pathlib import Path
import tempfile
import unittest

from pypdf import PdfReader, PdfWriter
from pypdf.annotations import Link, Text
from pypdf.generic import (ArrayObject, ByteStringObject, DecodedStreamObject, DictionaryObject, FloatObject,
                           NameObject, RectangleObject, TextStringObject)

from scripts import pdf_support as pdf

ROOT = Path(__file__).resolve().parents[1]
PRESENTATION = ROOT / "presentation" / "Singularity_AI_2027.pdf"
TITLE = "Singularity: How can we maintain control over increasingly complex AI systems?"
LIVE = "https://github.com/scaled-thinking/present-together/blob/main/docs/SINGULARITY-EXAMPLE.md#run-locally"
# Mirrors the local-user-path rule in scripts/check_public_package.py, which runs on import;
# split so this file does not itself match the rule. Keep both in step.
LOCAL_PATH_RULE = re.compile(r"[A-Z]:[/\\]Us" r"ers[/\\]", re.I)


def pdf_bytes(writer):
    """Serialize a synthetic document without writing a file."""
    stream = BytesIO()
    writer.write(stream)
    return stream.getvalue()


class PdfSupportTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.presentation = PdfReader(PRESENTATION)
        writer = PdfWriter()
        writer.add_page(cls.presentation.pages[0])
        cls.one_page = pdf_bytes(writer)

    def test_read_pdf_accepts_paths_bytes_streams_and_readers(self):
        for source in (PRESENTATION, str(PRESENTATION), PRESENTATION.read_bytes(),
                       BytesIO(PRESENTATION.read_bytes())):
            with self.subTest(source_type=type(source).__name__):
                self.assertEqual(len(pdf.read_pdf(source).pages), 17)
        self.assertIs(pdf.read_pdf(self.presentation), self.presentation)

    def test_committed_page_texts(self):
        texts = pdf.page_texts(self.presentation)
        self.assertEqual(len(texts), 17)
        self.assertTrue(all(len(text.strip()) > 30 for text in texts))
        self.assertIn("Singularity", texts[0])
        for text in texts[15:]:
            self.assertIn("WORKED EXAMPLE", text)
            for year in ("2025", "2026", "2027"):
                self.assertIn(year, text)
        for text in texts[12:15]:
            self.assertIn("https://", text)

    def test_blank_page_text_is_empty(self):
        writer = PdfWriter()
        writer.add_blank_page(width=200, height=300)
        self.assertEqual(pdf.page_texts(pdf_bytes(writer)), [""])

    def test_committed_metadata_is_json_serializable(self):
        info = pdf.metadata(PRESENTATION)
        self.assertEqual(info["/Title"], TITLE)
        self.assertEqual(info["/Author"], "Singularity seminar team")
        self.assertEqual(json.loads(json.dumps(info)), info)

    def test_missing_metadata_is_empty(self):
        writer = PdfWriter()
        writer.add_blank_page(width=200, height=300)
        writer.metadata = None
        self.assertEqual(pdf.metadata(pdf_bytes(writer)), {})

    def test_committed_page_ten_uri(self):
        # PUBLIC_URL can change the live link on re-export, so only its scheme is fixed.
        uris = pdf.page_link_uris(self.presentation.pages[9])
        self.assertTrue(any(uri.startswith("https://") for uri in uris), uris)

    def test_link_uris_ignore_non_uri_annotations(self):
        writer = PdfWriter()
        page = writer.add_blank_page(width=200, height=300)
        self.assertEqual(pdf.page_link_uris(page), [])
        writer.add_annotation(0, Text(rect=(10, 10, 30, 30), text="A local note"))
        writer.add_annotation(0, Link(rect=(0, 0, 50, 50), target_page_index=0))
        writer.add_annotation(0, Link(rect=(0, 0, 50, 50), url=LIVE))
        reader = pdf.read_pdf(pdf_bytes(writer))
        self.assertEqual(pdf.page_link_uris(reader.pages[0]), [LIVE])

    def test_link_values_include_file_targets_and_named_destinations(self):
        # Assembled at run time so this file does not itself trip the private-path check.
        local = "\\".join(("C:", "Us" + "ers", "someone", "private.pdf"))
        writer = PdfWriter()
        writer.add_blank_page(width=200, height=300)
        rect = ArrayObject([FloatObject(0)] * 4)

        def link(**entries):
            annotation = DictionaryObject({NameObject("/Type"): NameObject("/Annot"),
                                           NameObject("/Subtype"): NameObject("/Link"),
                                           NameObject("/Rect"): rect})
            annotation.update({NameObject("/" + key): value for key, value in entries.items()})
            return writer._add_object(annotation)

        launch = DictionaryObject({NameObject("/S"): NameObject("/Launch"),
                                   NameObject("/F"): writer._add_object(TextStringObject(local))})
        remote = DictionaryObject({NameObject("/S"): NameObject("/GoToR"),
                                   NameObject("/F"): TextStringObject("../private/notes.pdf"),
                                   NameObject("/D"): TextStringObject("speaker-notes")})
        indirect_uri = DictionaryObject({NameObject("/S"): NameObject("/URI"),
                                         NameObject("/URI"): writer._add_object(TextStringObject(LIVE))})
        annotations = ArrayObject([link(A=writer._add_object(launch)), link(A=remote),
                                   link(Dest=TextStringObject("named-destination")),
                                   link(A=writer._add_object(indirect_uri))])
        writer.pages[0][NameObject("/Annots")] = writer._add_object(annotations)
        page = pdf.read_pdf(pdf_bytes(writer)).pages[0]
        values = pdf.page_link_values(page)
        for expected in (local, "../private/notes.pdf", "speaker-notes", "named-destination", LIVE):
            self.assertIn(expected, values)
        self.assertEqual(pdf.page_link_uris(page), [LIVE])
        self.assertRegex("\n".join(values), LOCAL_PATH_RULE)

    def test_link_values_empty_without_links(self):
        writer = PdfWriter()
        writer.add_blank_page(width=200, height=300)
        writer.add_annotation(0, Text(rect=(10, 10, 30, 30), text="A local note"))
        self.assertEqual(pdf.page_link_values(pdf.read_pdf(pdf_bytes(writer)).pages[0]), [])

    def test_indirect_metadata_values_become_strings(self):
        writer = PdfWriter()
        writer.add_blank_page(width=200, height=300)
        writer._info.get_object()[NameObject("/Title")] = writer._add_object(TextStringObject("Indirect title"))
        info = pdf.metadata(pdf_bytes(writer))
        self.assertEqual(info["/Title"], "Indirect title")
        self.assertEqual(json.loads(json.dumps(info)), info)

    def test_metadata_keeps_backslash_paths_and_decodes_bytes(self):
        local = "\\".join(("C:", "Us" + "ers", "someone", "draft.pptx"))
        writer = PdfWriter()
        writer.add_blank_page(width=200, height=300)
        writer.add_metadata({"/Author": local})
        writer._info.get_object()[NameObject("/Creator")] = ByteStringObject(b"\xff\xfe raw")
        info = pdf.metadata(pdf_bytes(writer))
        self.assertEqual(info["/Author"], local)
        self.assertIsInstance(info["/Creator"], str)
        self.assertRegex("\n".join(info.values()), LOCAL_PATH_RULE)

    def test_single_page_text_matches_committed_page(self):
        self.assertEqual(pdf.single_page_text(self.one_page),
                         self.presentation.pages[0].extract_text())

    def test_single_page_text_rejects_zero_or_multiple_pages(self):
        for count in (0, 2):
            writer = PdfWriter()
            for _ in range(count):
                writer.add_blank_page(width=200, height=300)
            with self.subTest(page_count=count), self.assertRaises(AssertionError):
                pdf.single_page_text(pdf_bytes(writer))

    def test_add_uri_link_covers_full_media_box(self):
        writer = PdfWriter()
        writer.add_blank_page(width=100, height=100)
        page = writer.add_blank_page(width=200, height=300)
        page.mediabox = RectangleObject((10, 20, 210, 320))
        pdf.add_uri_link(writer, 1, LIVE)
        reader = pdf.read_pdf(pdf_bytes(writer))
        self.assertEqual(pdf.page_link_uris(reader.pages[0]), [])
        self.assertEqual(pdf.page_link_uris(reader.pages[1]), [LIVE])
        annotation = reader.pages[1]["/Annots"][0].get_object()
        self.assertEqual(list(annotation["/Rect"]), [10, 20, 210, 320])

    def test_merge_preserves_page_order_and_links(self):
        first = PdfWriter()
        first.add_blank_page(width=200, height=300)
        first.add_annotation(0, Link(rect=(10, 20, 80, 90), url=LIVE))
        first.add_outline_item(title="Source outline", page_number=0)
        second = PdfWriter()
        second.add_blank_page(width=400, height=500)
        second_uri = "https://example.org/second"
        second.add_annotation(0, Link(rect=(0, 0, 80, 90), url=second_uri))
        merged = pdf.merge_pages([pdf_bytes(first), pdf_bytes(second)])
        self.assertIsInstance(merged, PdfWriter)
        reader = pdf.read_pdf(pdf_bytes(merged))
        self.assertEqual([tuple(page.mediabox) for page in reader.pages],
                         [(0, 0, 200, 300), (0, 0, 400, 500)])
        self.assertEqual([pdf.page_link_uris(page) for page in reader.pages],
                         [[LIVE], [second_uri]])
        self.assertEqual(reader.outline, [])

    def test_outline_titles_destinations_and_replacement(self):
        writer = PdfWriter()
        for _ in range(2):
            writer.add_blank_page(width=200, height=300)
        pdf.set_outline(writer, [("Discarded", 0)])
        pdf.set_outline(writer, [("Opening", 0), ("Closing", 1)])
        reader = pdf.read_pdf(pdf_bytes(writer))
        self.assertEqual([item.title for item in reader.outline], ["Opening", "Closing"])
        self.assertEqual([reader.get_destination_page_number(item) for item in reader.outline], [0, 1])
        pdf.set_outline(writer, [])
        self.assertEqual(pdf.read_pdf(pdf_bytes(writer)).outline, [])

    def test_set_metadata_round_trip(self):
        writer = PdfWriter()
        writer.add_blank_page(width=200, height=300)
        pdf.set_metadata(writer, "Test title", "Test author", "Test subject")
        info = pdf.metadata(pdf_bytes(writer))
        self.assertEqual({key: info[key] for key in ("/Title", "/Author", "/Subject")},
                         {"/Title": "Test title", "/Author": "Test author", "/Subject": "Test subject"})

    def test_compressed_save_preserves_content_links_outline_and_metadata(self):
        writer = pdf.merge_pages([self.one_page, self.one_page])
        # Include an uncompressed stream so the saved compression is observable.
        content = DecodedStreamObject()
        content.set_data(b"q\nQ\n" * 100)
        writer.add_blank_page(width=200, height=300)[NameObject("/Contents")] = content
        pdf.add_uri_link(writer, 1, LIVE)
        pdf.set_outline(writer, [("First", 0), ("Second", 1)])
        pdf.set_metadata(writer, "Saved title", "Saved author", "Saved subject")
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "compressed.pdf"
            pdf.save_compressed(writer, path)
            reader = pdf.read_pdf(path)
            self.assertEqual(len(reader.pages), 3)
            self.assertEqual(pdf.page_texts(reader),
                             [pdf.single_page_text(self.one_page)] * 2 + [""])
            self.assertEqual(pdf.page_link_uris(reader.pages[1]), [LIVE])
            self.assertEqual([item.title for item in reader.outline], ["First", "Second"])
            self.assertEqual([reader.get_destination_page_number(item) for item in reader.outline], [0, 1])
            self.assertEqual(pdf.metadata(reader)["/Title"], "Saved title")
            stream = reader.pages[2]["/Contents"].get_object()
            self.assertEqual(stream["/Filter"], "/FlateDecode")
            self.assertEqual(stream.get_data(), b"q\nQ\n" * 100)

    def test_scripts_and_tests_do_not_import_legacy_pdf_backends(self):
        legacy_modules = {"".join(("py", "mu", "pdf")), "".join(("fi", "tz"))}
        for directory in (ROOT / "scripts", ROOT / "tests"):
            for path in directory.rglob("*.py"):
                with self.subTest(path=path.relative_to(ROOT).as_posix()):
                    tree = ast.parse(path.read_text(encoding="utf-8-sig"))
                    for node in ast.walk(tree):
                        if isinstance(node, ast.Import):
                            modules = [alias.name for alias in node.names]
                        elif isinstance(node, ast.ImportFrom):
                            modules = [node.module or ""]
                        else:
                            continue
                        self.assertFalse(legacy_modules.intersection(
                            module.split(".")[0] for module in modules))


if __name__ == "__main__":
    unittest.main()
