import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("courses", "0002_degree_university_year_degree_degree_university_and_more"),
        ("users", "0005_student_is_admin"),
    ]

    operations = [
        migrations.CreateModel(
            name="StudySession",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField(blank=True)),
                ("scheduled_at", models.DateTimeField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="study_sessions",
                        to="courses.course",
                    ),
                ),
                (
                    "creator",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="study_sessions",
                        to="users.student",
                    ),
                ),
            ],
            options={
                "ordering": ["scheduled_at"],
            },
        ),
    ]
