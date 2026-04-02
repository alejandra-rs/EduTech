from django.test import override_settings
from rest_framework.test import APITestCase
from documents.models import Post, PDFAttachment, YoutubeVideo
from ..config import TEST_STORAGES, make_student, make_course, make_pdf_file


@override_settings(STORAGES=TEST_STORAGES)
class PostFilterTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course  = make_course()

    def _make_pdf(self, title='PDFPost'):
        p = Post.objects.create(course=self.course, student=self.student,
                                title=title, description='D', post_type='PDF')
        PDFAttachment.objects.create(post=p, file=make_pdf_file())
        return p

    def _make_vid(self, title='VideoPost'):
        p = Post.objects.create(course=self.course, student=self.student,
                                title=title, description='D', post_type='VID')
        YoutubeVideo.objects.create(post=p, vid='https://www.youtube.com/watch?v=abc')
        return p

    def _data(self, url):
        r = self.client.get(url)
        return r.data

    def test_post_type_filter_pdf_only(self):
        self._make_pdf(); self._make_vid()
        self.assertEqual(len(self._data('/documents/?post_type=PDF')), 1)

    def test_post_type_filter_vid_only(self):
        self._make_pdf(); self._make_vid()
        self.assertEqual(len(self._data('/documents/?post_type=VID')), 1)

    def test_post_type_filter_multiple_values_returns_both(self):
        self._make_pdf(); self._make_vid()
        self.assertEqual(len(self._data('/documents/?post_type=PDF&post_type=VID')), 2)

    def test_post_type_invalid_value_returns_empty(self):
        self._make_pdf()
        response = self.client.get('/documents/?post_type=INVALID')
        self.assertEqual(response.status_code, 400)

        self.assertIn('post_type', response.data)
        self.assertEqual(
            response.data['post_type'][0],
            'Select a valid choice. INVALID is not one of the available choices.'
        )

    def test_search_title_partial_match(self):
        self._make_pdf(title='Kanban')
        self._make_pdf(title='Scrum Master')
        data = self._data('/documents/?search_title=master')
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'Scrum Master')

    def test_search_title_empty_string_returns_all(self):
        self._make_pdf(); self._make_vid()
        self.assertEqual(len(self._data('/documents/?search_title=')), 2)

    def test_combined_filter_post_type_and_title(self):
        self._make_pdf(title='Scrum Master')
        self._make_pdf(title='Scrum Guide')
        self._make_vid(title='Kanban Guide')
        data = self._data('/documents/?post_type=PDF&search_title=guide')
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'Scrum Guide')
