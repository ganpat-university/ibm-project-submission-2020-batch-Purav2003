from rest_framework.decorators import api_view
from base.models import User,Attendance
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
from datetime import date,datetime
from django.utils import timezone
from django.conf import settings


scanned_users = {}
# Load pre-trained InceptionResnetV1 model
model = InceptionResnetV1(pretrained='vggface2').eval()

def compare_faces(img_1, img_2):
    try:
        # Convert images to RGB format to handle the alpha channel
        img_1 = img_1.convert('RGB')
        img_2 = img_2.convert('RGB')

        # Convert images to PyTorch tensors
        img_tensor_1 = MTCNN()(img_1)
        img_tensor_2 = MTCNN()(img_2)

        # If using GPU, move the tensors to GPU
        if torch.cuda.is_available():
            img_tensor_1 = img_tensor_1.cuda()
            img_tensor_2 = img_tensor_2.cuda()

        # Expand dimensions to create batches with a single image each
        img_tensor_1 = img_tensor_1.unsqueeze(0)
        img_tensor_2 = img_tensor_2.unsqueeze(0)

        # Get face embeddings
        embeddings_1 = model(img_tensor_1)
        embeddings_2 = model(img_tensor_2)

        # Convert embeddings to numpy arrays for comparison
        embeddings_1_np = embeddings_1.cpu().detach().numpy()
        embeddings_2_np = embeddings_2.cpu().detach().numpy()

        # Calculate the Euclidean distance between the embeddings
        distance = np.linalg.norm(embeddings_1_np - embeddings_2_np)

        # Set a threshold for recognition
        threshold = 0.7

        # Compare distances for recognition
        if distance < threshold:
            return "The faces are recognized as the same person."
        else:
            return "The faces are recognized as different persons."

    except Exception as e:
        return str(e)

# Load pre-trained InceptionResnetV1 model

# Global dictionary to keep track of scanned users and their scan counts
scanned_users = {}

@api_view(['POST'])
def match_face(request):
    try:
        # Get base64-encoded image from the request
        base64_image_1 = request.data.get('image')

        # Decode base64 and create a BytesIO object
        img_data = base64.b64decode(base64_image_1)
        img_io = io.BytesIO(img_data)

        # Open the image using PIL
        img_1 = Image.open(img_io)

        # Specify the path to the image folder
        image_folder_path = "C:/Users/shahp/Desktop/SEM-8/IBM Project/cloud_enabled_attendance_system/backend/myproject/media/user_images"

        # Iterate over images in the folder and compare with img_1
        for filename in os.listdir(image_folder_path):
            img_path_2 = os.path.join(image_folder_path, filename)
            img_2 = Image.open(img_path_2)
            result = compare_faces(img_1, img_2)
            if result == "The faces are recognized as the same person.":
                user_image_path = 'user_images/' + filename

                # Check if the user has already been scanned today
                user = User.objects.filter(profilePhoto=user_image_path).first()
                if user:
                    today = date.today()
                    attendance_record = Attendance.objects.filter(user=user.name, date=today).first()

                    if not attendance_record:
                        # If no attendance record exists for today, create a new one with entry and exit times as current time
                        entry_time = datetime.now().time()
                        exit_time = datetime.now().time()
                        Attendance.objects.create(user=user, date=today, entry=entry_time, exit_time=exit_time, attendance=0)
                    else:
                        # Check if entry and exit times are the same
                        if attendance_record.entry == attendance_record.exit_time:
                            # Update entry time to current time
                            attendance_record.entry = datetime.now().time()
                            attendance_record.attendance = True
                            attendance_record.save()
                        else:
                            # Update exit time to current time
                            attendance_record.exit_time = datetime.now().time()
                            attendance_record.save()

                return JsonResponse({'result': 'Comparison completed successfully','user': user.name, 'attendance': attendance_record.attendance, 'entry': str(attendance_record.entry), 'exit': str(attendance_record.exit_time)})
        return JsonResponse({'result': 'Comparison completed successfully', 'user': 'No match found', 'attendance': 'N/A', 'entry': 'N/A', 'exit': 'N/A'})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
