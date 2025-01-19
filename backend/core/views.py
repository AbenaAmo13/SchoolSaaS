from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from core.utils.utils import add_license_key, generate_unique_school_code_with_check
from .models import School, User

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, permissions
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
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


class CreateSchool(APIView):
    def post(self, request):
        request_data = request.data
        admin_user_data= request_data.pop('admin_user_data')
        # Add logic to generate the license key
        license_key = generate_license_key()  # Generate a random license key
        # Include the generated license_key in the request data to be serialized
        request_data['license_key'] = license_key
        # Serialize the incoming data
        serializer = SchoolSerializer(data=request_data)
        # Validate and save the data if valid
        if serializer.is_valid() :
            # Save the new school object
            school = serializer.save()
            school_data = SchoolSerializer(school).data
            school_id= school_data.get('id')

            #Create admin user for the school
            admin_user_data['school'] = school
            user_serialiser = UserSerializer(data = admin_user_data)
            if user_serialiser.is_valid():
                user = user_serialiser.save()
                response_data = {
                    "school": serializer.data,
                    "user": user_serialiser.data
                }
                # Return the created school object with a 201 status
                return Response(response_data, status=status.HTTP_201_CREATED)
        # If validation fails, return errors with a 400 status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
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
