from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("courses", "0003_remove_course_courses_cou_name_eb4cc3_idx_and_more"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE courses_university
                    ADD COLUMN IF NOT EXISTS logo varchar(255) NULL;
            """,
            reverse_sql="""
                ALTER TABLE courses_university
                    DROP COLUMN IF EXISTS logo;
            """,
        ),
    ]
