from django.db import migrations, models


def add_logo_if_not_exists(apps, schema_editor):
    with schema_editor.connection.cursor() as cursor:
        cols = [c.name for c in schema_editor.connection.introspection.get_table_description(cursor, "courses_university")]
    if "logo" not in cols:
        from courses.models import University
        schema_editor.add_field(University, University._meta.get_field("logo"))


class Migration(migrations.Migration):
    dependencies = [
        ("courses", "0003_remove_course_courses_cou_name_eb4cc3_idx_and_more"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.AddField(
                    model_name="university",
                    name="logo",
                    field=models.ImageField(
                        blank=True, null=True, upload_to="logo_universities/", max_length=255
                    ),
                ),
            ],
            database_operations=[
                migrations.RunPython(add_logo_if_not_exists, migrations.RunPython.noop),
            ],
        ),
    ]
