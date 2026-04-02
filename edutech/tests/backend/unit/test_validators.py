from django.test import TestCase
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import IntegrityError
from documents.models import validate_pdf_extension, validate_pdf_size, MAX_PDF_KB


class PDFAttachmentValidatorTest(TestCase):

    def _file(self, name, size_bytes):
        return SimpleUploadedFile(name, b'x' * size_bytes)

    def test_extension_accepts_lowercase_pdf(self):
        validate_pdf_extension(self._file('doc.pdf', 10))

    def test_extension_case_insensitive(self):
        validate_pdf_extension(self._file('DOC.PDF', 10))

    def test_extension_rejects_non_pdf(self):
        with self.assertRaises(ValidationError):
            validate_pdf_extension(self._file('doc.docx', 10))

    def test_size_accepts_file_within_limit(self):
        validate_pdf_size(self._file('doc.pdf', (MAX_PDF_KB - 1) * 1024))

    def test_size_rejects_oversized_file(self):
        with self.assertRaises(ValidationError):
            validate_pdf_size(self._file('doc.pdf', (MAX_PDF_KB + 1) * 1024))

    def test_size_accepts_file_at_exact_boundary(self):
        validate_pdf_size(self._file('doc.pdf', MAX_PDF_KB * 1024))