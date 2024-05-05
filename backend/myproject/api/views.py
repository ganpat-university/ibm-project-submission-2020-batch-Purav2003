from rest_framework.response import Response    
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from base.models import User,Admin,Attendance
from .serializers import UserSerializer,AdminSerializer,AttendanceSerializer
from rest_framework import status
from django.contrib.auth.hashers import check_password
import jwt,datetime
from .decoretors import jwt_authorization
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
import random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from io import BytesIO
from django.core.files.base import ContentFile
from facenet_pytorch import InceptionResnetV1, MTCNN
from PIL import Image
import io
import base64
from django.views.decorators.csrf import csrf_exempt
import os
import torch
import numpy as np
from django.http import JsonResponse
from datetime import date
from django.utils import timezone
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = User.objects.get(email=email) if User.objects.filter(email=email).exists() else None    
    
    if user:
        if check_password(password, user.password):
            if(user.isAuthorized == "False"):
                user.isAuthorized = "sendRequest"        
                user.save()
            payload = {
                'id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=48),
                'iat': datetime.datetime.utcnow()
            }
                                
            token = jwt.encode(payload, key='secret', algorithm="HS256")
            response = Response()
            response.data = {
                'jwt':token,
                'status':'success',
                'id':user.id,
                'isAuthorized':user.isAuthorized,
                'companyCode':user.companyCode,
            }
            return response
        else:
            return Response({'status': 'error', 'message': 'Wrong Password'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['GET'])
@jwt_authorization
def getData(request,pk):
    items = User.objects.filter(companyCode=pk)
    serializer = UserSerializer(items,many=True)
    return Response(serializer.data)

@api_view(['POST'])
def signup(request):
    email = request.data.get('email')
    mobile = request.data.get('mobile')
    companyCode = request.data.get('companyCode')
    admin = Admin.objects.get(companyCode=companyCode) if Admin.objects.filter(companyCode=companyCode).exists() else None    

    print(mobile)
    mobile = str(mobile)
    print(mobile)
    user_email = None
    # user_phone = None
    print(mobile)
    try:
        user_email = User.objects.get(email=email) 
    except:
        user_email= None
    try:
        user_phone = User.objects.get(mobile=mobile) 
    except:
        user_phone = None
    print(user_phone)
    if user_email is None and user_phone is None and admin is not None:
        generated_otp = str(random.randint(1000, 9999))
        send_otp_email(email, generated_otp)

        # serializer = UserSerializer(data={'email': email, 'mobile': mobile, 'otp': generated_otp})        
        request.data['otp'] = generated_otp
        serializer = UserSerializer(data=request.data)
        # serializer = UserSerializer(data={'email': email, 'mobile': mobile, 'otp': generated_otp})        
        print(request.data)
        if serializer.is_valid():    
            serializer.save()
            return Response({'status': 'success', 'message': 'Data added successfully','email':email}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'message': 'Failed to add data'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if user_email is not None:
            return Response({'status': 'error', 'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        elif admin is None:
            return Response({'status': 'error', 'message': 'Invalid Company Code'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'status': 'error', 'message': 'Mobile already exists'}, status=status.HTTP_400_BAD_REQUEST)



def send_otp_email(receiver_email, otp):
    sender_email = os.getenv('EMAIL')
    sender_password = os.getenv('EMAIL_PASSWORD')
    # Send the OTP to the user's email using Django's send_mail function
    subject = f'Otp for verification'
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
    <h1>Sign Up OTP</h1>
    <p>Dear User,</p>
    <p>Your OTP for sign up is:</p>
    
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
    message['Subject'] = "OTP For Signup Verification"

# Attach the HTML content to the email
    message.attach(MIMEText(message_content, 'html'))

# Connect to the SMTP server and send the email
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
    
    
    
    
def send_verification_mail(receiver_email, companyName,userName,admin_email):
    sender_email = os.getenv('EMAIL')
    sender_password = os.getenv('EMAIL_PASSWORD')
    # Send the OTP to the user's email using Django's send_mail function
    subject = f'Welcome to the wokspace of {companyName}'
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

    .button {{
      display: inline-block;
      padding: 12px 24px;
      background-color: #3498db;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
      transition: background-color 0.3s ease;
    }}

    .button:hover {{
      background-color: #007bb5;
    }}
  </style>
</head>
<body>

  <div class="container">
    <h1>Welcome to the <span style="color: #e74c3c;">{companyName}</span> <br>on the Attendance Portal!</h1>
    <p>Dear <strong style="color: #000;font-weight:700">{userName}</strong>,</p>
    <p>We are thrilled to inform you that your request to join the <strong style="color: #000;font-weight:700">{companyName}</strong> on our attendance portal has been accepted. You are now a valued member, and you can start using the portal to manage your attendance.</p>    
    <p>Click the button below to access the attendance portal:</p>
    <a href="https://cloud-enabled-attendance-system.vercel.app/login" class="button">Access Attendance Portal</a>
    <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:{admin_email}" style="color: #3498db; text-decoration: none;">{admin_email}</a>.</p>
    <p>Best regards,<br> <span style="color: #3498db;">{companyName} Team</span></p>
  </div>

</body>
</html>


'''
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = "Welcome to the Workspace"

# Attach the HTML content to the email
    message.attach(MIMEText(message_content, 'html'))

# Connect to the SMTP server and send the email
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
    
def send_rejection_mail(receiver_email, companyName,userName,admin_email):
    sender_email = os.getenv('EMAIL')
    sender_password = os.getenv('EMAIL_PASSWORD')
    # Send the OTP to the user's email using Django's send_mail function
    subject = f'Welcome to the wokspace of {companyName}'
    message_content = f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }}

        .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }}

        h1 {{
            color: #333;
        }}

        p {{
            color: #666;
        }}

        .button {{
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }}

        .footer {{
            margin-top: 20px;
            color: #999;
            font-size: 12px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Request Update</h1>
        <p>Dear <strong style="color: #000;font-weight:700">{userName}</strong>,</p>
        <p>Your request to join {companyName}'s Attendance Portal has not been accepted.</p>
        <p>If you think something is wrong please contact your Admin on  <a href="mailto:{admin_email}" style="color: #3498db; text-decoration: none;">{admin_email}</a>.</p>
        <p>Best regards,<br> <span style="color: #3498db;">{companyName} Team</span></p>
        
    </div>
</body>
</html>



'''
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = "Regarding Attendance Portal Request"

# Attach the HTML content to the email
    message.attach(MIMEText(message_content, 'html'))

# Connect to the SMTP server and send the email
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
        
@api_view(['POST'])
def checkOtp(request,pk):
    items = User.objects.get(email=pk)
    otp = request.data.get('otp')
    otp = str(otp)
    otp_1 = str(items.otp)
    print(otp)
    print(items.otp) 
    if otp_1 == otp:
        return Response({'status': 'success', 'message': 'User authenticated'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'Wrong OTP'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@jwt_authorization
def updateUser(request, pk):
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    new_email = request.data.get('email')
    new_mobile = request.data.get('mobile')
    new_photo = request.data.get('profilePhoto')
    new_name = request.data.get('name')
    old_photo = str(user.profilePhoto)
    # old_photo_path = os.path.join('media', old_photo)

    print(new_photo)
    print(user.profilePhoto)
        
    if new_photo:
        if User.objects.filter(profilePhoto=new_photo).exists():
            pass
        else:        
            os.remove("C:/Users/shahp/Desktop/SEM-8/IBM Project/cloud_enabled_attendance_system/backend/myproject/media/"+old_photo)
            
    # Check if the new email already exists
    if User.objects.exclude(id=pk).filter(email=new_email).exists():
        return Response({'status': 'error', 'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the new mobile number already exists
    if User.objects.exclude(id=pk).filter(mobile=new_mobile).exists():
        return Response({'status': 'error', 'message': 'Mobile number already exists'}, status=status.HTTP_400_BAD_REQUEST)
    serializer = UserSerializer(instance=user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        Attendance.objects.filter(user_id=pk).update(user=new_name)        
        return Response({'status': 'success', 'message': 'User Updated'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'Validation Error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)  
    
@api_view(['GET'])
def delUser(request,pk):
    item = User.objects.get(id=pk)
    if item is not None:
        item.delete()        
        return Response({'status': 'success', 'message': 'User Deleted'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@jwt_authorization
def user_record(request, pk):      
    try:        
        user = User.objects.get(id=pk)
        admin = Admin.objects.get(companyCode=user.companyCode)
        company = admin.companyName

        serializer = UserSerializer(user)
        data = serializer.data
        data['company'] = company  # Include company in the response data

        return Response(data)
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
    except Admin.DoesNotExist:
        return Response({'status': 'error', 'message': 'Admin not found'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@jwt_authorization
def admin_record(request, pk):      
    try:        
        user = Admin.objects.get(id=pk)

        serializer =AdminSerializer(user)
        data = serializer.data
        return Response(data)
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
    except Admin.DoesNotExist:
        return Response({'status': 'error', 'message': 'Admin not found'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@jwt_authorization
def customer_record_pending(request,pk):   
    items = User.objects.filter(isAuthorized="sendRequest",companyCode=pk)
    if items.exists():
        serializer = UserSerializer(items, many=True)
        return Response(serializer.data)
    else:
        return Response({'status': 'error', 'message': 'No users found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@jwt_authorization
def customer_record_approved(request, pk):
    items = User.objects.filter(isAuthorized="AccessGranted", companyCode=pk)
    
    if items.exists():
        serializer = UserSerializer(items, many=True)
        return Response(serializer.data)
    else:
        return Response({'status': 'error', 'message': 'No users found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@jwt_authorization
def customer_record_rejected(request,pk):   
    items = User.objects.filter(isAuthorized="AccessDenied",companyCode=pk)
    if items.exists():
        serializer = UserSerializer(items, many=True)
        return Response(serializer.data)
    else:
        return Response({'status': 'error', 'message': 'No users found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@jwt_authorization
def access(request, pk):
    try:
        user = User.objects.get(id=pk)
        admin = Admin.objects.get(companyCode=user.companyCode)
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    user.isAuthorized = "AccessGranted"
    user.save()
    send_verification_mail(user.email, admin.companyName,user.name,admin.email)

    
    return Response({'status': 'success', 'message': 'User authenticated'}, status=status.HTTP_200_OK)
   
@api_view(['GET'])
@jwt_authorization
def deny(request, pk):
    try:
        user = User.objects.get(id=pk)
        admin = Admin.objects.get(companyCode=user.companyCode)
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    user.isAuthorized = "AccessDenied"
    user.save()
    send_rejection_mail(user.email, admin.companyName,user.name,admin.email)

    
    return Response({'status': 'success', 'message': 'User authenticated'}, status=status.HTTP_200_OK)
 


@api_view(['GET'])
def all_attendance(request,pk):
    items = Attendance.objects.filter(companyCode=pk,date=timezone.now().date())
    serializer = AttendanceSerializer(items,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def date_attendance(request,pk,dk):
    items = Attendance.objects.filter(companyCode=pk,date = dk)
    serializer = AttendanceSerializer(items,many=True)
    return Response(serializer.data)




### ADMIN ###

@api_view(['POST'])
def adminSignup(request):
    email = request.data.get('email')
    mobile = request.data.get('mobile')
    companyCode = request.data.get('companyCode')
    password = request.data.get('password')
    mobile = str(mobile)
   
    try:
        admin_email = Admin.objects.get(email=email) 
    except:
        admin_email= None
    try:
        admin_phone = Admin.objects.get(mobile=mobile) 
    except:
        admin_phone = None
    try:
        company_code = Admin.objects.get(companyCode=companyCode) 
    except:
        company_code = None
        
    if admin_email is None and admin_phone is None and company_code is None:
        serializer = AdminSerializer(data=request.data)
        if serializer.is_valid():            
            # encrypted_password = make_password(password)            
            # serializer.validated_data['password'] = encrypted_password
            serializer.save()
            return Response({'status': 'success', 'message': 'Data added successfully'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'message': 'Failed to add data'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if admin_email is not None:
            return Response({'status': 'error', 'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        elif admin_phone is not None:
            return Response({'status': 'error', 'message': 'Mobile already exists'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'status': 'error', 'message': 'Company Code already exists'}, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['POST'])
def adminLogin(request):
    email = request.data.get('email')
    password = request.data.get('password')

    admin = Admin.objects.get(email=email) if Admin.objects.filter(email=email).exists() else None    

    if admin:
        print(f"Database Password: {admin.password}")
        print(f"Entered Password: {password}")

        if check_password(password, admin.password):
            payload = {
                'id': admin.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=60),
                'iat': datetime.datetime.utcnow()
            }
                                
            token = jwt.encode(payload, key='secret', algorithm="HS256")
            response = Response()
            response.data = {
                'jwt':token,
                'status':'success',
                'id':admin.id,
                'companyName':admin.companyName,
                'companyCode':admin.companyCode,
            }
            return response
        else:
            return Response({'status': 'error', 'message': 'Wrong Password'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
   