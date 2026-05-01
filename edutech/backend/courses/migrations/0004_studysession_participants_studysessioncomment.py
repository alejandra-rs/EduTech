import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("courses", "0003_studysession"),
        ("users", "0005_student_is_admin"),
    ]

    operations = [
        migrations.AddField(
            model_name="studysession",
            name="participants",
            field=models.ManyToManyField(
                blank=True,
                related_name="participating_sessions",
                to="users.student",
            ),
        ),
        migrations.CreateModel(
            name="StudySessionComment",
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
                ("message", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "session",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="session_comments",
                        to="courses.studysession",
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="study_session_comments",
                        to="users.student",
                    ),
                ),
            ],
            options={
                "ordering": ["created_at"],
            },
        ),
    ]
