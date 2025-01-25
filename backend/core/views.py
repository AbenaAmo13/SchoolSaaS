from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from core.utils.utils import add_license_key, generate_unique_school_code_with_check
from .models import School, User, ApplicationModules

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, permissions
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, SchoolSerializer, CreateSchoolAndAdminSerializer, ApplicationModulesSerializer

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
            # Return both school and user in the response
            return Response({
                "school": SchoolSerializer(result['school']).data,
                "user": UserSerializer(result['user']).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            user_information = UserSerializer(user).data
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_information': user_information
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
