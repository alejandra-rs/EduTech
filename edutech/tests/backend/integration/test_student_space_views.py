from django.utils import timezone
from rest_framework.test import APITestCase
from student_space.models import Folder, SavedPost
from ..config import make_student, make_course, make_post, make_root_folder, make_saved_post


ROOT_URL = '/student-space/folders/root/'
FOLDERS_URL = '/student-space/folders/'
POSTS_URL = '/student-space/posts/'
PINNED_URL = '/student-space/pinned/'

def _folder_url(pk): return f'/student-space/folders/{pk}/'
def _folder_move_url(pk): return f'/student-space/folders/{pk}/move/'
def _post_url(pk): return f'/student-space/posts/{pk}/'
def _post_move_url(pk): return f'/student-space/posts/{pk}/move/'


class FolderRootViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()

    def test_get_creates_root(self):
        response = self.client.get(ROOT_URL, {'student': self.student.pk})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Folder.objects.filter(student=self.student, depth=1).count(), 1)

    def test_get_does_not_duplicate_root(self):
        Folder.add_root(name='root', student=self.student)
        response = self.client.get(ROOT_URL, {'student': self.student.pk})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Folder.objects.filter(student=self.student, depth=1).count(), 1)

    def test_get_returns_expected_fields(self):
        response = self.client.get(ROOT_URL, {'student': self.student.pk})
        for field in ('id', 'name', 'depth', 'path', 'children', 'saved_posts'):
            self.assertIn(field, response.data)

    def test_get_nonexistent_student_returns_404(self):
        response = self.client.get(ROOT_URL, {'student': 99999})
        self.assertEqual(response.status_code, 404)

    def test_get_includes_saved_posts(self):
        root = make_root_folder(self.student)
        course = make_course()
        post = make_post(student=self.student, course=course)
        SavedPost.objects.create(folder=root, post=post)
        response = self.client.get(ROOT_URL, {'student': self.student.pk})
        self.assertEqual(len(response.data['saved_posts']), 1)

    def test_get_includes_subfolders(self):
        root = make_root_folder(self.student)
        root.add_child(name='PS', student=self.student)
        response = self.client.get(ROOT_URL, {'student': self.student.pk})
        self.assertEqual(len(response.data['children']), 1)


class FolderCreateViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.root = make_root_folder(self.student)

    def test_create_subfolder_returns_201(self):
        response = self.client.post(FOLDERS_URL, {
            'name': 'PS', 'parent_id': self.root.pk, 'student_id': self.student.pk,
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Folder.objects.filter(student=self.student, depth__gt=1).count(), 1)

    def test_response_contains_folder_fields(self):
        response = self.client.post(FOLDERS_URL, {
            'name': 'PS', 'parent_id': self.root.pk, 'student_id': self.student.pk,
        }, format='json')
        for field in ('id', 'name', 'depth'):
            self.assertIn(field, response.data)
        self.assertEqual(response.data['depth'], 2)

    def test_duplicate_sibling_name_returns_409(self):
        self.root.add_child(name='PS', student=self.student)
        response = self.client.post(FOLDERS_URL, {
            'name': 'PS', 'parent_id': self.root.pk, 'student_id': self.student.pk,
        }, format='json')
        self.assertEqual(response.status_code, 409)

    def test_same_name_different_parent_returns_201(self):
        child = self.root.add_child(name='PS', student=self.student)
        response = self.client.post(FOLDERS_URL, {
            'name': 'PS', 'parent_id': child.pk, 'student_id': self.student.pk,
        }, format='json')
        self.assertEqual(response.status_code, 201)

    def test_nonexistent_parent_returns_404(self):
        response = self.client.post(FOLDERS_URL, {
            'name': 'PS', 'parent_id': 99999, 'student_id': self.student.pk,
        }, format='json')
        self.assertEqual(response.status_code, 404)

    def test_other_student_parent_returns_404(self):
        other_student = make_student(email='other@test.com')
        other_root = make_root_folder(other_student)
        response = self.client.post(FOLDERS_URL, {
            'name': 'PS', 'parent_id': other_root.pk, 'student_id': self.student.pk,
        }, format='json')
        self.assertEqual(response.status_code, 404)

    def test_exceeding_100_folders_returns_400(self):
        for i in range(100):
            self.root.add_child(name=f'Folder{i}', student=self.student)
        response = self.client.post(FOLDERS_URL, {
            'name': 'Inválido', 'parent_id': self.root.pk, 'student_id': self.student.pk,
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Folder.objects.filter(student=self.student, depth__gt=1).count(), 100)


class FolderDetailViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.root = make_root_folder(self.student)
        self.child = self.root.add_child(name='PS', student=self.student)

    def test_get_returns_200_with_correct_fields(self):
        response = self.client.get(_folder_url(self.child.pk), {'student': self.student.pk})
        self.assertEqual(response.status_code, 200)
        for field in ('id', 'name', 'depth', 'path', 'children', 'saved_posts'):
            self.assertIn(field, response.data)

    def test_get_path_contains_ancestor(self):
        grandchild = self.child.add_child(name='Scrum', student=self.student)
        response = self.client.get(_folder_url(grandchild.pk), {'student': self.student.pk})
        path_ids = [f['id'] for f in response.data['path']]
        self.assertIn(self.root.pk, path_ids)
        self.assertIn(self.child.pk, path_ids)

    def test_get_root_path_is_empty(self):
        response = self.client.get(_folder_url(self.root.pk), {'student': self.student.pk})
        self.assertEqual(response.data['path'], [])

    def test_get_wrong_student_returns_404(self):
        other = make_student(email='other@test.com')
        response = self.client.get(_folder_url(self.child.pk), {'student': other.pk})
        self.assertEqual(response.status_code, 404)

    def test_patch_renames_folder(self):
        response = self.client.patch(
            _folder_url(self.child.pk) + f'?student={self.student.pk}',
            {'name': 'Producción de Software'}, format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.child.refresh_from_db()
        self.assertEqual(self.child.name, 'Producción de Software')

    def test_patch_rename_root_returns_400(self):
        response = self.client.patch(
            _folder_url(self.root.pk) + f'?student={self.student.pk}',
            {'name': 'Producción de Software'}, format='json',
        )
        self.assertEqual(response.status_code, 400)

    def test_patch_duplicate_sibling_name_returns_409(self):
        self.root.add_child(name='Scrum', student=self.student)
        response = self.client.patch(
            _folder_url(self.child.pk) + f'?student={self.student.pk}',
            {'name': 'Scrum'}, format='json',
        )
        self.assertEqual(response.status_code, 409)

    def test_delete_subfolder_returns_204(self):
        response = self.client.delete(_folder_url(self.child.pk) + f'?student={self.student.pk}')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Folder.objects.filter(pk=self.child.pk).exists())

    def test_delete_cascades_to_saved_posts(self):
        post = make_post(student=self.student, course=self.course)
        saved = SavedPost.objects.create(folder=self.child, post=post)
        self.client.delete(_folder_url(self.child.pk) + f'?student={self.student.pk}')
        self.assertFalse(SavedPost.objects.filter(pk=saved.pk).exists())

    def test_delete_root_returns_400(self):
        response = self.client.delete(_folder_url(self.root.pk) + f'?student={self.student.pk}')
        self.assertEqual(response.status_code, 400)
        self.assertTrue(Folder.objects.filter(pk=self.root.pk).exists())


class FolderMoveViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.root = make_root_folder(self.student)
        self.folder_a = self.root.add_child(name='PS', student=self.student)
        self.folder_b = self.root.add_child(name='Scrum', student=self.student)

    def test_move_folder_to_sibling_returns_200(self):
        response = self.client.patch(
            _folder_move_url(self.folder_a.pk) + f'?student={self.student.pk}',
            {'target_id': self.folder_b.pk}, format='json',
        )
        self.assertEqual(response.status_code, 200)
        folder_a_fresh = Folder.objects.get(pk=self.folder_a.pk)
        self.assertEqual(folder_a_fresh.depth, 3)
        self.assertEqual(folder_a_fresh.get_parent().pk, self.folder_b.pk)

    def test_move_root_returns_400(self):
        response = self.client.patch(
            _folder_move_url(self.root.pk) + f'?student={self.student.pk}',
            {'target_id': self.folder_a.pk}, format='json',
        )
        self.assertEqual(response.status_code, 400)

    def test_move_into_descendant_returns_400(self):
        child = self.folder_a.add_child(name='Kanban', student=self.student)
        response = self.client.patch(
            _folder_move_url(self.folder_a.pk) + f'?student={self.student.pk}',
            {'target_id': child.pk}, format='json',
        )
        self.assertEqual(response.status_code, 400)

    def test_move_into_self_returns_400(self):
        response = self.client.patch(
            _folder_move_url(self.folder_a.pk) + f'?student={self.student.pk}',
            {'target_id': self.folder_a.pk}, format='json',
        )
        self.assertEqual(response.status_code, 400)

    def test_move_into_other_student_folder_returns_404(self):
        other = make_student(email='other@test.com')
        other_root = make_root_folder(other)
        response = self.client.patch(
            _folder_move_url(self.folder_a.pk) + f'?student={self.student.pk}',
            {'target_id': other_root.pk}, format='json',
        )
        self.assertEqual(response.status_code, 404)


class SavedPostViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.post = make_post(student=self.student, course=self.course)
        self.root = make_root_folder(self.student)

    def test_save_post_returns_201(self):
        response = self.client.post(POSTS_URL, {
            'folder_id': self.root.pk, 'post_id': self.post.pk, 'student_id': self.student.pk,
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(SavedPost.objects.count(), 1)

    def test_save_duplicate_returns_409(self):
        SavedPost.objects.create(folder=self.root, post=self.post)
        response = self.client.post(POSTS_URL, {
            'folder_id': self.root.pk, 'post_id': self.post.pk, 'student_id': self.student.pk,
        }, format='json')
        self.assertEqual(response.status_code, 409)
        self.assertEqual(SavedPost.objects.count(), 1)

    def test_save_draft_returns_400(self):
        draft = make_post(student=self.student, course=self.course, title='Draft', is_draft=True)
        response = self.client.post(POSTS_URL, {
            'folder_id': self.root.pk, 'post_id': draft.pk, 'student_id': self.student.pk,
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(SavedPost.objects.count(), 0)

    def test_save_to_other_student_folder_returns_404(self):
        other = make_student(email='other@test.com')
        other_root = make_root_folder(other)
        response = self.client.post(POSTS_URL, {
            'folder_id': other_root.pk, 'post_id': self.post.pk, 'student_id': self.student.pk,
        }, format='json')
        self.assertEqual(response.status_code, 404)

    def test_delete_saved_post_returns_204(self):
        saved = SavedPost.objects.create(folder=self.root, post=self.post)
        response = self.client.delete(_post_url(saved.pk) + f'?student={self.student.pk}')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(SavedPost.objects.count(), 0)

    def test_delete_other_student_saved_post_returns_403(self):
        other = make_student(email='other@test.com')
        other_root = make_root_folder(other)
        saved = SavedPost.objects.create(folder=other_root, post=self.post)
        response = self.client.delete(_post_url(saved.pk) + f'?student={self.student.pk}')
        self.assertEqual(response.status_code, 403)
        self.assertTrue(SavedPost.objects.filter(pk=saved.pk).exists())

    def test_patch_pin_sets_is_pinned_true(self):
        saved = SavedPost.objects.create(folder=self.root, post=self.post)
        response = self.client.patch(
            _post_url(saved.pk) + f'?student={self.student.pk}',
            {'is_pinned': True}, format='json',
        )
        self.assertEqual(response.status_code, 200)
        saved.refresh_from_db()
        self.assertTrue(saved.is_pinned)
        self.assertIsNotNone(saved.pinned_at)

    def test_patch_unpin_clears_is_pinned(self):
        saved = SavedPost.objects.create(
            folder=self.root, post=self.post, is_pinned=True, pinned_at=timezone.now(),
        )
        response = self.client.patch(
            _post_url(saved.pk) + f'?student={self.student.pk}',
            {'is_pinned': False}, format='json',
        )
        self.assertEqual(response.status_code, 200)
        saved.refresh_from_db()
        self.assertFalse(saved.is_pinned)
        self.assertIsNone(saved.pinned_at)


class SavedPostMoveViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.post = make_post(student=self.student, course=self.course)
        self.root = make_root_folder(self.student)
        self.folder_a = self.root.add_child(name='A', student=self.student)
        self.folder_b = self.root.add_child(name='B', student=self.student)
        self.saved = SavedPost.objects.create(folder=self.folder_a, post=self.post)

    def test_move_to_different_folder_returns_200(self):
        response = self.client.patch(
            _post_move_url(self.saved.pk) + f'?student={self.student.pk}',
            {'folder_id': self.folder_b.pk}, format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.saved.refresh_from_db()
        self.assertEqual(self.saved.folder.pk, self.folder_b.pk)

    def test_move_to_same_folder_returns_400(self):
        response = self.client.patch(
            _post_move_url(self.saved.pk) + f'?student={self.student.pk}',
            {'folder_id': self.folder_a.pk}, format='json',
        )
        self.assertEqual(response.status_code, 400)

    def test_move_when_post_already_in_target_returns_409(self):
        SavedPost.objects.create(folder=self.folder_b, post=self.post)
        response = self.client.patch(
            _post_move_url(self.saved.pk) + f'?student={self.student.pk}',
            {'folder_id': self.folder_b.pk}, format='json',
        )
        self.assertEqual(response.status_code, 409)

    def test_move_to_other_student_folder_returns_404(self):
        other = make_student(email='other@test.com')
        other_root = make_root_folder(other)
        response = self.client.patch(
            _post_move_url(self.saved.pk) + f'?student={self.student.pk}',
            {'folder_id': other_root.pk}, format='json',
        )
        self.assertEqual(response.status_code, 404)


class PinnedPostViewTest(APITestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.root = make_root_folder(self.student)

    def test_get_returns_empty_list_when_no_pins(self):
        response = self.client.get(PINNED_URL, {'student': self.student.pk})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_get_returns_only_pinned_posts(self):
        post_a = make_post(student=self.student, course=self.course, title='A')
        post_b = make_post(student=self.student, course=self.course, title='B')
        SavedPost.objects.create(folder=self.root, post=post_a, is_pinned=True, pinned_at=timezone.now())
        SavedPost.objects.create(folder=self.root, post=post_b)
        response = self.client.get(PINNED_URL, {'student': self.student.pk})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['post']['id'], post_a.pk)

    def test_get_ordered_by_pinned_at_descending(self):
        from datetime import timedelta
        from django.utils import timezone as tz
        post_a = make_post(student=self.student, course=self.course, title='A')
        post_b = make_post(student=self.student, course=self.course, title='B')
        now = tz.now()
        SavedPost.objects.create(folder=self.root, post=post_a, is_pinned=True, pinned_at=now - timedelta(hours=1))
        SavedPost.objects.create(folder=self.root, post=post_b, is_pinned=True, pinned_at=now)
        response = self.client.get(PINNED_URL, {'student': self.student.pk})
        self.assertEqual(response.data[0]['post']['id'], post_b.pk)
        self.assertEqual(response.data[1]['post']['id'], post_a.pk)

    def test_get_nonexistent_student_returns_404(self):
        response = self.client.get(PINNED_URL, {'student': 99999})
        self.assertEqual(response.status_code, 404)

    def test_pinned_posts_from_other_student_not_returned(self):
        other = make_student(email='other@test.com')
        other_root = make_root_folder(other)
        post = make_post(student=other, course=self.course)
        SavedPost.objects.create(folder=other_root, post=post, is_pinned=True, pinned_at=timezone.now())
        response = self.client.get(PINNED_URL, {'student': self.student.pk})
        self.assertEqual(response.data, [])
