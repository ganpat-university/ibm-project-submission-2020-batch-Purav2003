# Generated by Django 5.0.4 on 2024-04-24 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('email', models.CharField(max_length=100)),
                ('mobile', models.CharField(max_length=15)),
                ('password', models.CharField(max_length=100)),
                ('companyCode', models.CharField(max_length=20)),
                ('companyName', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(max_length=50)),
                ('user', models.CharField(max_length=50)),
                ('date', models.DateField(auto_now_add=True)),
                ('entry', models.TimeField(auto_now_add=True)),
                ('exit_time', models.TimeField(auto_now_add=True)),
                ('attendance', models.BooleanField(default=False)),
                ('companyCode', models.CharField(max_length=20)),
                ('onLeave', models.BooleanField(default=False)),
                ('isHoliday', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Holiday',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('companyCode', models.CharField(max_length=20)),
                ('dates', models.CharField(max_length=1000)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Leave',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(max_length=50)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('leave_type', models.CharField(max_length=100)),
                ('reason', models.CharField(max_length=100)),
                ('status', models.CharField(default='Pending', max_length=100)),
                ('companyCode', models.CharField(default='123456', max_length=100)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('email', models.CharField(max_length=100)),
                ('mobile', models.CharField(max_length=15)),
                ('password', models.CharField(max_length=100)),
                ('companyCode', models.CharField(max_length=20)),
                ('department', models.CharField(max_length=20)),
                ('profilePhoto', models.ImageField(blank=True, null=True, upload_to='user_images/')),
                ('isAuthorized', models.CharField(default=False, max_length=100)),
                ('otp', models.IntegerField(blank=True, null=True)),
                ('forgot_otp', models.IntegerField(blank=True, default=0, null=True)),
            ],
        ),
        migrations.DeleteModel(
            name='Record',
        ),
    ]