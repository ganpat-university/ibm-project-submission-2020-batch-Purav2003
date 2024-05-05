@echo off
cd /d "C:\Users\shahp\Desktop\SEM-8\IBM Project\virt\Scripts"
call activate
cd /d "C:\Users\shahp\Desktop\SEM-8\IBM Project\cloud_enabled_attendance_system\backend\myproject"
python manage.py mark_attendance
