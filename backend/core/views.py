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
        print(response_data.data)
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


class CreateSchoolAndAdminView1(APIView):

    def post(self, request):
         # Extract school and user data
        data = request.data
        school_data = data.pop('school')
        user_data = data.pop('user')
        # Create school
        # Deserialize the incoming data
        school_serializer = SchoolSerializer(data=school_data)
        user_serializer = UserSerializer(data=user_data)
        if school_serializer.is_valid() and user_serializer.is_valid():
            # If data is valid, create both the school and user
            school = school_serializer.save()
            school_data = SchoolSerializer(school).data
            school_id= school_data.get('id')

            user_data['school'] = school_id
            user_serializer = UserSerializer(data=user_data)
            user = user_serializer.save()


            # Return both school and user in the response
            return Response({
                "school": school_data,
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class CreateSchoolAndAdminView(APIView):
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
