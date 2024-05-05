from django.core.files.storage import FileSystemStorage
from datetime import date
from collections import defaultdict
from datetime import datetime, timedelta
from base.models import Attendance,Leave,User,Holiday
from rest_framework.response import Response    
from rest_framework.decorators import api_view
from datetime import datetime
from .serializers import UserSerializer,LeaveSerializer,AttendanceSerializer,HolidaySerializer
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .decoretors import jwt_authorization
from django.contrib.auth.hashers import make_password
import random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

@api_view(['POST'])
def get_attendance_month(request,pk):
    today = datetime.now()
    month = request.data['month']
    year = request.data['year']
    attendances = Attendance.objects.filter(companyCode=pk,date__month=month,date__year=year)
    serializer = AttendanceSerializer(attendances,many=True)
    if serializer.data:
        return Response(serializer.data)
    else:
        return Response({"message":"No data found"})


@api_view(['POST'])
def get_leave_year(request,pk):
    year = request.data['year']
    user_id = request.data['userId']
    if user_id==0 or user_id == "0":
        leaves = Leave.objects.filter(companyCode=pk,start_date__year=year)
    else:
        leaves = Leave.objects.filter(companyCode=pk,start_date__year=year,user_id=user_id)
    leaves_with_name = []
    for leave in leaves:
        user = User.objects.get(id=leave.user_id)
        total_leaves = (leave.end_date - leave.start_date).days + 1
        leave_data = {
            "id":leave.id,
            "user_id":leave.user_id,
            "start_date":leave.start_date,
            "end_date":leave.end_date,
            "leave_type":leave.leave_type,
            "reason":leave.reason,
            "status":leave.status,
            "user_name":user.name,
            "total_leaves":total_leaves
        }
        leaves_with_name.append(leave_data)
    monthly_leave_count = defaultdict(dict)

# Iterate through leaves_with_name
    for leave in leaves_with_name:
    # Parse start_date to get the month
        start_date = leave['start_date']
        month = start_date.strftime("%B")

    # Add user_name to monthly_leave_count if not present
        if leave["user_name"] not in monthly_leave_count[month]:
            monthly_leave_count[month][leave["user_name"]] = 0

    # Increment leave count for the user within the month
        monthly_leave_count[month][leave["user_name"]] += leave["total_leaves"]

# Convert monthly_leave_count to the desired response format
    response = [
    {month: leave_counts} 
    for month, leave_counts in monthly_leave_count.items()
    ]
    return Response(response)
    
   
@api_view(['POST'])
def get_working_hours(request,pk):
    today = datetime.now()
    month = request.data['month']
    year = request.data['year']
    user_id = request.data['userId']
    if user_id==0 or user_id == "0" or user_id == None :
        attendances = Attendance.objects.filter(companyCode=pk,date__month=month,date__year=year,user_id=1)
    attendances = Attendance.objects.filter(companyCode=pk,date__month=month,date__year=year,user_id=user_id)
    serializer = AttendanceSerializer(attendances,many=True)
    if serializer.data:
        return Response(serializer.data)
    else:
        return Response({"message":"No data found"})
    
    
@api_view(['POST'])
def get_attendance_month_user(request,pk):
    today = datetime.now()
    month = request.data['month']
    year = request.data['year']
    attendances = Attendance.objects.filter(user_id=pk,date__month=month,date__year=year)
    # ṭotal count of present and absent
    total_present = 0
    total_absent = 0
    for attendance in attendances:
        if attendance.attendance:
            total_present += 1
        else:
            total_absent += 1
    response = {
        "total_present":total_present,
        "total_absent":total_absent
    }
    if response:
        return Response(response)
    else:
        return Response({"message":"No data found"})

@api_view(['POST'])
def get_leave_year_user(request,pk):
    year = request.data['year']   
    leaves = Leave.objects.filter(start_date__year=year,user_id=pk)
    leaves_with_name = []
    for leave in leaves:
        user = User.objects.get(id=leave.user_id)
        total_leaves = (leave.end_date - leave.start_date).days + 1
        leave_data = {
            "id":leave.id,
            "user_id":leave.user_id,
            "start_date":leave.start_date,
            "end_date":leave.end_date,
            "leave_type":leave.leave_type,
            "reason":leave.reason,
            "status":leave.status,
            "user_name":user.name,
            "total_leaves":total_leaves
        }
        leaves_with_name.append(leave_data)
    monthly_leave_count = defaultdict(dict)

# Iterate through leaves_with_name
    for leave in leaves_with_name:
    # Parse start_date to get the month
        start_date = leave['start_date']
        month = start_date.strftime("%B")

    # Add user_name to monthly_leave_count if not present
        if leave["user_name"] not in monthly_leave_count[month]:
            monthly_leave_count[month][leave["user_name"]] = 0

    # Increment leave count for the user within the month
        monthly_leave_count[month][leave["user_name"]] += leave["total_leaves"]

# Convert monthly_leave_count to the desired response format
    response = [
    {month: leave_counts} 
    for month, leave_counts in monthly_leave_count.items()
    ]
    return Response(response)


@api_view(['POST'])
def get_working_hours_user(request,pk):
    today = datetime.now()
    month = request.data['month']
    year = request.data['year']
    attendances = Attendance.objects.filter(date__month=month,date__year=year,user_id=pk)
    serializer = AttendanceSerializer(attendances,many=True)
    if serializer.data:
        return Response(serializer.data)
    else:
        return Response({"message":"No data found"})