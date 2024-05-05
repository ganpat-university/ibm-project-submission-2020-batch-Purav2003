# decorators.py
from django.http import JsonResponse
import jwt
from django.conf import settings

def jwt_authorization(view_func):
    def wrapper(request, *args, **kwargs):
        # Get the JWT token from the request headers
        jwt_token = request.headers.get('Authorization')
        print(jwt_token)
        if jwt_token:
           
            try:
                # Decode and verify the token
                decoded_token = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
                
                # You can do additional checks on the decoded token here

            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token has expired'}, status=401)

            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Invalid token'}, status=401)

        else:
            return JsonResponse({'error': 'Token missing'}, status=401)

        # Call the original view function
        return view_func(request, *args, **kwargs)

    return wrapper
