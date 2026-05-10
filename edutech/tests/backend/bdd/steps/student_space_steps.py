from behave import given, when, then
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings

TEST_STORAGES = {
    'default':     {'BACKEND': 'django.core.files.storage.InMemoryStorage'},
    'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
}

def _get_root(context):
    from student_space.models import Folder
    return Folder.objects.filter(student=context.student, depth=1).first()

def _get_folder(context, name):
    from student_space.models import Folder
    return Folder.objects.filter(student=context.student, name=name).first()

def _get_saved(context, folder=None):
    from student_space.models import SavedPost
    f = folder or _get_root(context)
    return SavedPost.objects.filter(folder=f, post=context.post).first()



@given('que existe el espacio personal del estudiante')
def step_personal_space_exists(context):
    from student_space.models import Folder
    root = Folder.objects.filter(student=context.student, depth=1).first()
    if not root:
        root = Folder.add_root(name='root', student=context.student)
    context.root = root

@given('que el estudiante no tiene el contenido guardado')
def step_content_not_saved(context):
    pass

@given('que el estudiante tiene el contenido guardado en su carpeta raíz')
def step_content_saved_in_root(context):
    from student_space.models import SavedPost
    context.saved, _ = SavedPost.objects.get_or_create(folder=context.root, post=context.post)

@given('que el estudiante tiene el contenido guardado en la carpeta "{name}"')
def step_content_saved_in_folder(context, name):
    from student_space.models import SavedPost
    folder = _get_folder(context, name)
    context.saved, _ = SavedPost.objects.get_or_create(folder=folder, post=context.post)

@given('que el estudiante tiene el contenido guardado en la carpeta raíz')
def step_content_saved_in_root_alias(context):
    from student_space.models import SavedPost
    context.saved, _ = SavedPost.objects.get_or_create(folder=context.root, post=context.post)

@given('que existe un borrador con título "{title}"')
def step_draft_exists(context, title):
    from documents.models import Post
    context.draft = Post.objects.create(
        course=context.course, student=context.student,
        title=title, description='D', post_type='PDF', is_draft=True,
    )

@given('que el estudiante tiene una carpeta llamada "{name}" en la raíz')
def step_folder_in_root(context, name):
    from student_space.models import Folder
    folder, _ = Folder.objects.get_or_create(
        name=name, defaults={'student': context.student}
    ) if False else (None, None)
    folder = _get_folder(context, name)
    if not folder:
        folder = context.root.add_child(name=name, student=context.student)
    setattr(context, f'folder_{name}', folder)

@given('que el estudiante tiene una carpeta llamada "{name}" dentro de "{parent_name}"')
def step_subfolder(context, name, parent_name):
    parent = _get_folder(context, parent_name)
    folder = parent.add_child(name=name, student=context.student)
    setattr(context, f'folder_{name}', folder)

@given('que el estudiante ha creado 100 subcarpetas')
def step_100_folders(context):
    for i in range(100):
        context.root.add_child(name=f'Carpeta{i}', student=context.student)

@given('que el contenido no está fijado')
def step_content_not_pinned(context):
    context.saved.is_pinned = False
    context.saved.pinned_at = None
    context.saved.save()

@given('que el contenido está fijado')
def step_content_pinned(context):
    from django.utils import timezone
    context.saved.is_pinned = True
    context.saved.pinned_at = timezone.now()
    context.saved.save()



@when('el estudiante guarda el contenido en su carpeta raíz')
def step_save_content(context):
    context.response = context.client.post('/student-space/posts/', {
        'folder_id': context.root.pk,
        'post_id': context.post.pk,
        'student_id': context.student.pk,
    }, format='json')

@when('el estudiante elimina el contenido guardado')
def step_delete_saved(context):
    context.response = context.client.delete(
        f'/student-space/posts/{context.saved.pk}/?student={context.student.pk}'
    )

@when('el estudiante intenta guardar el borrador en su carpeta raíz')
def step_save_draft(context):
    context.response = context.client.post('/student-space/posts/', {
        'folder_id': context.root.pk,
        'post_id': context.draft.pk,
        'student_id': context.student.pk,
    }, format='json')

@when('el estudiante accede a su espacio personal')
def step_access_space(context):
    context.response = context.client.get(
        f'/student-space/folders/root/?student={context.student.pk}'
    )

@when('el estudiante accede a la carpeta "{name}"')
def step_access_folder(context, name):
    folder = _get_folder(context, name)
    context.response = context.client.get(
        f'/student-space/folders/{folder.pk}/?student={context.student.pk}'
    )

@when('el estudiante crea una carpeta llamada "{name}" en la raíz')
def step_create_folder_in_root(context, name):
    context.response = context.client.post('/student-space/folders/', {
        'name': name,
        'parent_id': context.root.pk,
        'student_id': context.student.pk,
    }, format='json')
    if context.response.status_code == 201:
        context.created_folder_id = context.response.data['id']

@when('el estudiante crea una carpeta llamada "{name}" dentro de "{parent_name}"')
def step_create_folder_in_parent(context, name, parent_name):
    parent = _get_folder(context, parent_name)
    context.response = context.client.post('/student-space/folders/', {
        'name': name,
        'parent_id': parent.pk,
        'student_id': context.student.pk,
    }, format='json')
    if context.response.status_code == 201:
        context.created_folder_id = context.response.data['id']

@when('el estudiante renombra la carpeta "{old_name}" a "{new_name}"')
def step_rename_folder(context, old_name, new_name):
    folder = _get_folder(context, old_name)
    context.renamed_folder = folder
    context.response = context.client.patch(
        f'/student-space/folders/{folder.pk}/?student={context.student.pk}',
        {'name': new_name}, format='json',
    )

@when('el estudiante elimina la carpeta "{name}"')
def step_delete_folder(context, name):
    folder = _get_folder(context, name)
    context.deleted_folder = folder
    context.response = context.client.delete(
        f'/student-space/folders/{folder.pk}/?student={context.student.pk}'
    )

@when('el estudiante intenta eliminar la carpeta raíz')
def step_delete_root(context):
    context.response = context.client.delete(
        f'/student-space/folders/{context.root.pk}/?student={context.student.pk}'
    )

@when('el estudiante mueve el contenido a la carpeta "{name}"')
def step_move_saved_post(context, name):
    folder = _get_folder(context, name)
    context.target_folder = folder
    context.response = context.client.patch(
        f'/student-space/posts/{context.saved.pk}/move/?student={context.student.pk}',
        {'folder_id': folder.pk}, format='json',
    )

@when('el estudiante intenta mover el contenido a una carpeta inexistente')
def step_move_to_nonexistent(context):
    context.response = context.client.patch(
        f'/student-space/posts/{context.saved.pk}/move/?student={context.student.pk}',
        {'folder_id': 99999}, format='json',
    )

@when('el estudiante intenta mover el contenido de la raíz a la carpeta "{name}"')
def step_move_root_saved_to_folder(context, name):
    folder = _get_folder(context, name)
    from student_space.models import SavedPost
    saved_in_root = SavedPost.objects.get(folder=context.root, post=context.post)
    context.response = context.client.patch(
        f'/student-space/posts/{saved_in_root.pk}/move/?student={context.student.pk}',
        {'folder_id': folder.pk}, format='json',
    )

@when('el estudiante fija el contenido')
def step_pin_content(context):
    context.response = context.client.patch(
        f'/student-space/posts/{context.saved.pk}/?student={context.student.pk}',
        {'is_pinned': True}, format='json',
    )

@when('el estudiante desfija el contenido')
def step_unpin_content(context):
    context.response = context.client.patch(
        f'/student-space/posts/{context.saved.pk}/?student={context.student.pk}',
        {'is_pinned': False}, format='json',
    )



@then('el contenido aparece guardado en la carpeta raíz')
def step_content_in_root(context):
    from student_space.models import SavedPost
    assert SavedPost.objects.filter(folder=context.root, post=context.post).exists(), \
        'El contenido no está guardado en la carpeta raíz'

@then('el contenido ya no aparece en el espacio personal')
def step_content_not_in_space(context):
    from student_space.models import SavedPost
    assert not SavedPost.objects.filter(post=context.post, folder__student=context.student).exists(), \
        'El contenido sigue en el espacio personal'

@then('el contenido no se guarda')
def step_content_not_saved_assert(context):
    from student_space.models import SavedPost
    assert SavedPost.objects.count() == 0, 'Se guardó contenido cuando no debería'

@then('la respuesta incluye el contenido guardado')
def step_response_has_saved_posts(context):
    data = context.response.data
    saved = data.get('saved_posts', [])
    assert len(saved) >= 1, f'Se esperaba al menos 1 contenido guardado, hay {len(saved)}'

@then('la respuesta no incluye contenido guardado')
def step_response_has_no_saved_posts(context):
    saved = context.response.data.get('saved_posts', [])
    assert len(saved) == 0, f'Se esperaban 0 contenidos guardados, hay {len(saved)}'

@then('la respuesta no incluye subcarpetas')
def step_response_has_no_children(context):
    children = context.response.data.get('children', [])
    assert len(children) == 0, f'Se esperaban 0 subcarpetas, hay {len(children)}'

@then('la carpeta "{name}" aparece como hija de la raíz')
def step_folder_is_child_of_root(context, name):
    from student_space.models import Folder
    assert Folder.objects.filter(student=context.student, name=name, depth=2).exists(), \
        f'La carpeta "{name}" no existe como hija de la raíz'

@then('la carpeta creada tiene profundidad 3')
def step_folder_depth_3(context):
    from student_space.models import Folder
    folder = Folder.objects.get(pk=context.created_folder_id)
    assert folder.depth == 3, f'Se esperaba profundidad 3, se obtuvo {folder.depth}'

@then('la carpeta tiene el nombre "{name}"')
def step_folder_has_name(context, name):
    context.renamed_folder.refresh_from_db()
    assert context.renamed_folder.name == name, \
        f'Se esperaba el nombre "{name}", se obtuvo "{context.renamed_folder.name}"'

@then('la carpeta "{name}" ya no existe')
def step_folder_not_exists(context, name):
    from student_space.models import Folder
    assert not Folder.objects.filter(student=context.student, name=name).exists(), \
        f'La carpeta "{name}" sigue existiendo'

@then('el contenido guardado también se elimina')
def step_saved_post_also_deleted(context):
    from student_space.models import SavedPost
    assert not SavedPost.objects.filter(post=context.post).exists(), \
        'El contenido guardado no fue eliminado junto con la carpeta'

@then('la subcarpeta "{name}" también se elimina')
def step_subfolder_also_deleted(context, name):
    from student_space.models import Folder
    assert not Folder.objects.filter(student=context.student, name=name).exists(), \
        f'La subcarpeta "{name}" no fue eliminada'

@then('la carpeta raíz sigue existiendo')
def step_root_still_exists(context):
    from student_space.models import Folder
    assert Folder.objects.filter(pk=context.root.pk).exists(), \
        'La carpeta raíz fue eliminada'

@then('el contenido pertenece a la carpeta "{name}"')
def step_content_in_folder(context, name):
    from student_space.models import SavedPost
    folder = _get_folder(context, name)
    assert SavedPost.objects.filter(folder=folder, post=context.post).exists(), \
        f'El contenido no pertenece a la carpeta "{name}"'

@then('el contenido ya no pertenece a la carpeta "{name}"')
def step_content_not_in_folder(context, name):
    from student_space.models import SavedPost
    folder = _get_folder(context, name)
    assert not SavedPost.objects.filter(folder=folder, post=context.post).exists(), \
        f'El contenido sigue en la carpeta "{name}"'

@then('el contenido sigue perteneciendo a la carpeta "Origen"')
def step_content_still_in_origen(context):
    from student_space.models import SavedPost
    folder = _get_folder(context, 'Origen')
    assert SavedPost.objects.filter(folder=folder, post=context.post).exists(), \
        'El contenido ya no está en la carpeta "Origen"'

@then('el contenido aparece en la sección de fijados')
def step_content_in_pinned(context):
    from student_space.models import SavedPost
    assert SavedPost.objects.filter(
        folder__student=context.student, post=context.post, is_pinned=True
    ).exists(), 'El contenido no aparece como fijado'
    response = context.client.get(f'/student-space/pinned/?student={context.student.pk}')
    pinned_ids = [item['post']['id'] for item in response.data]
    assert context.post.pk in pinned_ids, 'El contenido no aparece en la sección de fijados'

@then('el contenido ya no aparece en la sección de fijados')
def step_content_not_in_pinned(context):
    response = context.client.get(f'/student-space/pinned/?student={context.student.pk}')
    pinned_ids = [item['post']['id'] for item in response.data]
    assert context.post.pk not in pinned_ids, 'El contenido sigue en la sección de fijados'

@then('el contenido sigue perteneciendo a su carpeta original')
def step_content_still_in_original_folder(context):
    from student_space.models import SavedPost
    context.saved.refresh_from_db()
    assert SavedPost.objects.filter(pk=context.saved.pk, folder=context.root).exists(), \
        'El contenido no pertenece a su carpeta original'
