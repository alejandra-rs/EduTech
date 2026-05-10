from django.test import TestCase
from django.db import IntegrityError, transaction
from documents.models import Post
from student_space.models import Folder, SavedPost
from ..config import make_student, make_course, make_post, make_root_folder


class FolderModelTest(TestCase):

    def setUp(self):
        self.student = make_student()

    def test_add_root_creates_depth_1(self):
        root = Folder.add_root(name='root', student=self.student)
        self.assertEqual(root.depth, 1)

    def test_add_child_creates_depth_2(self):
        root = Folder.add_root(name='root', student=self.student)
        child = root.add_child(name='PS', student=self.student)
        self.assertEqual(child.depth, 2)

    def test_add_grandchild_creates_depth_3(self):
        root = Folder.add_root(name='root', student=self.student)
        child = root.add_child(name='PS', student=self.student)
        grandchild = child.add_child(name='Scrum', student=self.student)
        self.assertEqual(grandchild.depth, 3)

    def test_get_ancestors_of_child_returns_root(self):
        root = Folder.add_root(name='root', student=self.student)
        child = root.add_child(name='PS', student=self.student)
        ancestors = list(child.get_ancestors())
        self.assertEqual(len(ancestors), 1)
        self.assertEqual(ancestors[0].pk, root.pk)

    def test_get_ancestors_of_grandchild_returns_two_levels(self):
        root = Folder.add_root(name='root', student=self.student)
        child = root.add_child(name='PS', student=self.student)
        grandchild = child.add_child(name='Scrum', student=self.student)
        ancestors = list(grandchild.get_ancestors())
        self.assertEqual(len(ancestors), 2)
        self.assertEqual(ancestors[0].pk, root.pk)
        self.assertEqual(ancestors[1].pk, child.pk)

    def test_get_ancestors_of_root_returns_empty(self):
        root = Folder.add_root(name='root', student=self.student)
        self.assertEqual(list(root.get_ancestors()), [])

    def test_get_children_returns_only_direct_children(self):
        root = Folder.add_root(name='root', student=self.student)
        child = root.add_child(name='PS', student=self.student)
        child.add_child(name='Scrum', student=self.student)
        children = list(root.get_children())
        self.assertEqual(len(children), 1)
        self.assertEqual(children[0].pk, child.pk)

    def test_is_descendant_of_returns_true_for_ancestor(self):
        root = Folder.add_root(name='root', student=self.student)
        child = root.add_child(name='PS', student=self.student)
        grandchild = child.add_child(name='Scrum', student=self.student)
        self.assertTrue(grandchild.is_descendant_of(root))
        self.assertTrue(grandchild.is_descendant_of(child))

    def test_is_descendant_of_returns_false_for_sibling(self):
        root = Folder.add_root(name='root', student=self.student)
        child_a = root.add_child(name='PS', student=self.student)
        child_b = root.add_child(name='Kanban', student=self.student)
        self.assertFalse(child_b.is_descendant_of(child_a))

    def test_delete_folder_cascades_to_descendants(self):
        root = Folder.add_root(name='root', student=self.student)
        child = root.add_child(name='PS', student=self.student)
        grandchild = child.add_child(name='Scrum', student=self.student)
        child.delete()
        self.assertFalse(Folder.objects.filter(pk=grandchild.pk).exists())

    def test_str_contains_name(self):
        root = Folder.add_root(name='root', student=self.student)
        self.assertIn('root', str(root))


class SavedPostModelTest(TestCase):

    def setUp(self):
        self.student = make_student()
        self.course = make_course()
        self.post = make_post(student=self.student, course=self.course)
        self.root = Folder.add_root(name='root', student=self.student)

    def test_is_pinned_defaults_to_false(self):
        saved = SavedPost.objects.create(folder=self.root, post=self.post)
        self.assertFalse(saved.is_pinned)

    def test_pinned_at_defaults_to_none(self):
        saved = SavedPost.objects.create(folder=self.root, post=self.post)
        self.assertIsNone(saved.pinned_at)

    def test_unique_constraint_same_folder_and_post(self):
        SavedPost.objects.create(folder=self.root, post=self.post)
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                SavedPost.objects.create(folder=self.root, post=self.post)

    def test_same_post_allowed_in_different_folders(self):
        child = self.root.add_child(name='PS', student=self.student)
        SavedPost.objects.create(folder=self.root, post=self.post)
        saved2 = SavedPost.objects.create(folder=child, post=self.post)
        self.assertEqual(saved2.folder, child)

    def test_delete_folder_cascades_to_saved_posts(self):
        child = self.root.add_child(name='PS', student=self.student)
        saved = SavedPost.objects.create(folder=child, post=self.post)
        child.delete()
        self.assertFalse(SavedPost.objects.filter(pk=saved.pk).exists())

    def test_delete_post_cascades_to_saved_posts(self):
        saved = SavedPost.objects.create(folder=self.root, post=self.post)
        self.post.delete()
        self.assertFalse(SavedPost.objects.filter(pk=saved.pk).exists())

    def test_pin_sets_is_pinned_and_pinned_at(self):
        from django.utils import timezone
        saved = SavedPost.objects.create(folder=self.root, post=self.post)
        saved.is_pinned = True
        saved.pinned_at = timezone.now()
        saved.save()
        saved.refresh_from_db()
        self.assertTrue(saved.is_pinned)
        self.assertIsNotNone(saved.pinned_at)

    def test_unpin_clears_is_pinned_and_pinned_at(self):
        from django.utils import timezone
        saved = SavedPost.objects.create(folder=self.root, post=self.post, is_pinned=True, pinned_at=timezone.now())
        saved.is_pinned = False
        saved.pinned_at = None
        saved.save()
        saved.refresh_from_db()
        self.assertFalse(saved.is_pinned)
        self.assertIsNone(saved.pinned_at)

    def test_str_contains_post_and_folder(self):
        saved = SavedPost.objects.create(folder=self.root, post=self.post)
        self.assertIn(str(self.post), str(saved))
        self.assertIn(str(self.root), str(saved))
