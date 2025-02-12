from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from core.utils.utils import add_license_key, generate_unique_school_code_with_check

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import School, User, ApplicationModules
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from rest_framework import generics, permissions
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, SchoolSerializer, CreateSchoolAndAdminSerializer, ApplicationModulesSerializer


class CookiesJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        if not access_token:
            return None
        validated_token = self.get_validated_token(access_token)
        try:
            user = self.get_user(validated_token)
        except AuthenticationFailed:
            return None

        return (user, validated_token)



class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        data = ApplicationModules.objects.all()
        response_data = ApplicationModulesSerializer(data, many=True)
        return Response(response_data.data, status=status.HTTP_201_CREATED)


    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_information = UserSerializer(user).data
            refresh = RefreshToken.for_user(user)
            response ={
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_information': user_information
            }

            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateSchoolAndAdminView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        # Deserialize the incoming data
        serializer = CreateSchoolAndAdminSerializer(data=request.data)
        if serializer.is_valid():
            # If data is valid, create both the school and user
            result = serializer.save()
            user = result['user']
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token =str(refresh.access_token)
            refresh_token= str(refresh)
            response = Response({
                "school": SchoolSerializer(result['school']).data,
                "user": UserSerializer(user).data,
                'access_token': access_token, 
                'refresh_token': refresh_token
            }, status=status.HTTP_201_CREATED)
            # Set HttpOnly, Secure, SameSite cookies
            response.set_cookie('access_token', access_token, httponly=True, secure=True, samesite='Strict')
            response.set_cookie('refresh_token', refresh_token, httponly=True, secure=True, samesite='Strict')
            # Return both school and user in the response
            return  response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            print(refresh_token)
            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens['access']
            res = Response()
            res.data = { 'access_token': access_token, 'refreshed': True}
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            return res
        except Exception as e:
            print(e)
            return Response({'refreshed': False})


class ReloadTokens(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        print(request.COOKIES)
        try:
            refresh_token = request.COOKIES.get('refresh_token', None)
            if not refresh_token:
                return Response({'error': 'No refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
            refresh = RefreshToken(refresh_token)  # Fix: Properly create RefreshToken instance
            access_token = str(refresh.access_token)
            return Response({
                'access_token': access_token,
                'refresh_token': refresh_token, 
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            user_information = UserSerializer(user).data
            refresh = RefreshToken.for_user(user)
            refresh_token =  str(refresh)
            access_token = str(refresh.access_token)
            response = Response({'user': user_information, 'access_token': access_token, 'refresh_token': refresh_token}, status=status.HTTP_200_OK)
            is_production = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE']  # True in prod, False in dev
            print(is_production)
            # Set HttpOnly, Secure, SameSite cookies
            response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE'], 
                    value=access_token,
                    secure=is_production,
                    httponly=True,
                    samesite= 'Lax' if not is_production else 'None',
                    path='/'  # Ensures the cookie is available for all endpoints
            )
            response.set_cookie(
                    key='refresh_token', 
                    value=refresh_token,
                    secure=is_production,
                    httponly=True,
                    samesite='Lax' if not is_production else 'None',
                    path='/'  # Ensures the cookie is available for all endpoints
            )
            return response
     
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
