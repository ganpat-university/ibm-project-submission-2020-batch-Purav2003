# celery.py or tasks.py

from celery import Celery
from celery.schedules import crontab

app = Celery('base')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Define a periodic task to run the management command daily at 12 AM
app.conf.beat_schedule = {
    'mark_attendance_daily': {
        'task': 'myapp.tasks.mark_attendance',
        'schedule': crontab(hour=0, minute=0),  # Run daily at 12 AM
    },
}
