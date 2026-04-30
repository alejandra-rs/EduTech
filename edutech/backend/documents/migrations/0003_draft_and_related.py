from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("documents", "0002_question_alter_post_post_type_flashcarddeck_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="is_draft",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="post",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
    ]
