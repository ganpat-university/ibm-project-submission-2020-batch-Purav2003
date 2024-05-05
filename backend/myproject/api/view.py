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
def get_attendance(request, pk):
    year = int(request.data.get('year'))
    month = int(request.data.get('month'))
    
    first_day_of_month = datetime(year, month, 1).date()
    if month == 12:
        last_day_of_month = datetime(year + 1, 1, 1).date()
    else:
        last_day_of_month = datetime(year, month + 1, 1).date() - timedelta(days=1)

    items = Attendance.objects.filter(user_id=pk, date__range=[first_day_of_month, last_day_of_month])

    # Serialize the data
    if items:
        serializer = AttendanceSerializer(items, many=True)
        return Response(serializer.data)
    else:
        return Response({'status': 'error', 'message': 'No attendance records found'}, status=status.HTTP_404_NOT_FOUND)
 
 
@api_view(['GET'])
def last_5_days_attendance(request,pk):
    today = datetime.now().date()
    five_days_ago = today - timedelta(days=6)
    yeterday = today - timedelta(days=1)
    # Query attendance records for the company within the date range
    attendance_records = Attendance.objects.filter(companyCode=pk, date__range=[five_days_ago, yeterday])
    
    # Initialize a defaultdict to store attendance counts for each day
    attendance_counts = defaultdict(lambda: {'date': '', 'total_users': 0, 'present_users': 0})
    
    # Iterate over attendance records and accumulate counts
    for record in attendance_records:
        attendance_date = record.date.strftime('%Y-%m-%d')
        attendance_counts[attendance_date]['date'] = attendance_date
        attendance_counts[attendance_date]['total_users'] += 1
        if record.attendance:
            attendance_counts[attendance_date]['present_users'] += 1
    
    # Calculate the percentage of attendance for each day
    for date, counts in attendance_counts.items():
        total_employees = counts['total_users']
        present_employees = counts['present_users']
        if total_employees > 0:
            percentage = (present_employees / total_employees) * 100
        else:
            percentage = 0
        counts['percentage_present'] = percentage
    
    # Convert the defaultdict to a list of dictionaries
    attendance_list = [counts for date, counts in attendance_counts.items()]
    
    # Return the attendance counts with date in JSON format
    return Response({'data': attendance_list})



@api_view(['GET'])
def date_absent(request,pk):
    items = Attendance.objects.filter(user_id=pk,attendance=False, onLeave=False)
    serializer = AttendanceSerializer(items,many=True)
    dates = [item['date'] for item in serializer.data]
    return Response(dates)

@api_view(['GET'])
def date_leave(request,pk):
    items = Attendance.objects.filter(user_id=pk, onLeave=True)
    serializer = AttendanceSerializer(items,many=True)    
    dates = [item['date'] for item in serializer.data]
    return Response(dates)




@api_view(['GET'])
def leave_remaining(request, pk):
    leave_counts = {
        'Sick Leave': 7,
        'Casual Leave': 7,
        'Privileged Leave': 3,
        'Paternity Leave': 15
    }

    # Initialize dictionary to store used leave counts
    used_leave_counts = {leave_type: 0 for leave_type in leave_counts}

    # Get today's date
    today = timezone.now().date()

    # Iterate over leave entries for the user
    user_leave_entries = Leave.objects.filter(user_id=pk, status="Leave Granted")
    for leave_entry in user_leave_entries:
        leave_type = leave_entry.leave_type
        start_date = leave_entry.start_date
        end_date = leave_entry.end_date

        # Calculate the total number of days for this leave entry
        total_days = (end_date - start_date).days + 1  # Adding 1 to include both start and end dates

        # Update the used leave counts for this leave type
        used_leave_counts[leave_type] += total_days

    # Calculate remaining leave counts
    remaining_counts = {leave_type: leave_counts[leave_type] - used_leave_counts.get(leave_type, 0) for leave_type in leave_counts}

    response_data = {
        'Sick Leave': {
            'total': leave_counts['Sick Leave'],
            'remaining': remaining_counts['Sick Leave']
        },
        'Casual Leave': {
            'total': leave_counts['Casual Leave'],
            'remaining': remaining_counts['Casual Leave']
        },
        'Privileged Leave': {
            'total': leave_counts['Privileged Leave'],
            'remaining': remaining_counts['Privileged Leave']
        },
        'Paternity Leave': {
            'total': leave_counts['Paternity Leave'],
            'remaining': remaining_counts['Paternity Leave']
        }
    }

    return Response(response_data)


@api_view(['POST'])
def leave_application(request):
    serializer = LeaveSerializer(data=request.data)
    if serializer.is_valid():    
        serializer.save()
        return Response({'status': 'success', 'message': 'Leave Applied successfully'}, status=status.HTTP_201_CREATED)      
    return Response({'status': 'error', 'message': 'Failed to add data'}, status=status.HTTP_400_BAD_REQUEST)
        
    

@api_view(['GET'])
def leave_user(request, pk):
    current_month = datetime.now().month
    current_year = datetime.now().year
    items = Leave.objects.filter(user_id=pk, timestamp__month=current_month, timestamp__year=current_year)
    serializer = LeaveSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def leave_user_pending(request,pk):
    current_month = datetime.now().month
    current_year = datetime.now().year
    items = Leave.objects.filter(status="Pending",companyCode = pk ,timestamp__month=current_month, timestamp__year=current_year)
    serializer = LeaveSerializer(items, many=True)  
    for leave_data in serializer.data:
        user_id = leave_data['user_id']
        user = User.objects.get(id=user_id)  
        leave_data['user_name'] = user.name  
      
    return Response(serializer.data)

@api_view(['GET'])
def leave_user_approved(request,pk):
    current_month = datetime.now().month
    current_year = datetime.now().year
    entry_time = datetime.now().time()
    exit_time = datetime.now().time()
    items = Leave.objects.filter(status="Leave Granted", companyCode = pk, timestamp__month=current_month, timestamp__year=current_year)
    serializer = LeaveSerializer(items, many=True)  
    for leave_data in serializer.data:
        user_id = leave_data['user_id']
        user = User.objects.get(id=user_id)  
        leave_data['user_name'] = user.name  
      
    return Response(serializer.data)

@api_view(['GET'])
def leave_status_update_approve(request, pk):
    try:
        leave = get_object_or_404(Leave, id=pk)
    except Leave.DoesNotExist:
        return Response({'status': 'error', 'message': 'Leave not found'}, status=status.HTTP_404_NOT_FOUND)
    
    leave.status = "Leave Granted"
    leave.save()    
    
    start_date = leave.start_date
    end_date = leave.end_date
    user_id = leave.user_id
    user = get_object_or_404(User, id=user_id)
    name = user.name
    company_code = user.companyCode 
    entry_time = datetime.now().time()
    exit_time = datetime.now().time()
    print(start_date)
    
    for current_date in range((end_date - start_date).days + 1):
        current_date = start_date + timedelta(days=current_date)
        
        attendance, created = Attendance.objects.get_or_create(
            user_id=user_id,
            date=current_date,
            user=name,
            onLeave=True, 
            entry=entry_time,
            exit_time=exit_time,
            companyCode= company_code
        )
        if not created:
            attendance.onLeave = True
            attendance.companyCode = company_code
            attendance.save()
    
    attendance.save()

    
    return Response({'status': 'success', 'message': 'Leave Approved'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def leave_status_update_deny(request,pk):
    try:
        leave = Leave.objects.get(id=pk)
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    leave.status = "Leave Denied"
    leave.save()    
    return Response({'status': 'success', 'message': 'Leave Denied'}, status=status.HTTP_200_OK)
 
 
@api_view(['GET'])
def today_on_leave(request,pk):
    today = datetime.now().date()
    items = Attendance.objects.filter(companyCode=pk, date=today, onLeave=True)
    serializer = AttendanceSerializer(items, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@jwt_authorization
def reset_password(request):
    id = request.data.get('id')
    password = request.data.get('password')
    user = User.objects.get(id=id)    
    if(user):
        password = make_password(password)        
        user.password = password
        user.save()
        return Response({'status': 'success', 'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    

def send_otp_forgot_email(receiver_email, otp):
    sender_email = "shahpurav308@gmail.com"
    sender_password = "npgb ndoe saio zghl"
    # Send the OTP to the user's email using Django's send_mail function
    subject = f'Otp for Reset Password'
    message_content = f'''
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {{
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f6f8fa;
      margin: 0;
      padding: 0;
    }}

    .container {{
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      color: #333;
    }}

    h1 {{
      color: #3498db;
    }}

    p {{
      color: #555;
      line-height: 1.6;
    }}

    .otp-container {{
      background-color: #3498db;
      color: #ffffff;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
      text-align: center;
      font-size: 24px;
      display:inline-block;
    }}
  </style>
</head>
<body>

  <div class="container">
    <h1>Reset Password OTP</h1>
    <p>Dear User,</p>
    <p>Your OTP To Reset Your Password:</p>
    
    <div class="otp-container">
      <strong>{ otp }</strong>
    </div>
  </div>

</body>
</html>



'''
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = "OTP For Reset Password"

# Attach the HTML content to the email
    message.attach(MIMEText(message_content, 'html'))

# Connect to the SMTP server and send the email
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())


@api_view(['POST'])
def send_email_forgot_password(request,email):
    generated_otp = str(random.randint(1000, 9999))
    send_otp_forgot_email(email, generated_otp)
    user = User.objects.get(email=email)
    user.forgot_otp = generated_otp
    user.save()
    return Response({'status': 'success', 'message': 'OTP sent to the user\'s email'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def forgotPass_checkOtp(request,pk):
    items = User.objects.get(email=pk)
    otp = request.data.get('otp')
    otp = str(otp)
    otp_1 = str(items.forgot_otp) 
    if otp_1 == otp:
        return Response({'status': 'success', 'message': 'User authenticated'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'Wrong OTP'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def forgotPass(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = User.objects.get(email=email)    
    if(user):
        password = make_password(password)        
        user.password = password
        user.save()
        return Response({'status': 'success', 'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def add_holidays(request,pk):
    dates = request.data.get('dates')
    companyCode = pk
    holiday = Holiday(companyCode=companyCode,dates=dates)
    if(holiday):
        holiday.save()
        return Response({'status': 'success', 'message': 'Holiday added successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'Failed to add holiday'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def view_holidays(request,pk):
    items = Holiday.objects.filter(companyCode=pk)
    print(items)
    serializer = HolidaySerializer(items,many=True)
    if serializer:
        return Response(serializer.data)
    else:
        return Response({'status': 'error', 'message': 'No holidays found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_holidays(request, pk):
    items = Holiday.objects.filter(companyCode=pk)
    days = request.data.get('dates')
    if items:
        for item in items:
            item.dates = days
            item.save()
        return Response({'status': 'success', 'message': 'Holidays Updated'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'No holidays found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def update_exit_time_by_id(request, pk):
    try:
        attendance = Attendance.objects.get(id=pk)
    except Attendance.DoesNotExist:
        return Response({'status': 'error', 'message': 'Attendance not found'}, status=status.HTTP_404_NOT_FOUND)
    
    exit_time_str = request.data.get('exit_time')
    try:
        exit_time = datetime.strptime(exit_time_str, '%H:%M:%S').time()
    except ValueError:
        return Response({'status': 'error', 'message': 'Invalid exit time format'}, status=status.HTTP_400_BAD_REQUEST)
    
    current_time = datetime.now().time()
    
    if exit_time > current_time:
        return Response({'status': 'error', 'message': 'Exit time cannot be in the future'}, status=status.HTTP_400_BAD_REQUEST)
    
    if exit_time < attendance.entry:
        return Response({'status': 'error', 'message': 'Exit time cannot be before entry time'}, status=status.HTTP_400_BAD_REQUEST)
    
    attendance.exit_time = exit_time
    attendance.save()
    return Response({'status': 'success', 'message': 'Exit time updated'}, status=status.HTTP_200_OK)
