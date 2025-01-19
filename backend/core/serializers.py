from rest_framework import serializers
from .models import School, User
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group

class UserSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all())
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'school']

class SchoolSerialiser(serializers.ModelSerializer):
    modules = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True)

    class Meta:
        model = School
        fields = ['id', 'modules', 'name', 'contact_number', 'email', 'cambridge_certified', 'license_activation_date',  'school_acronym']
        read_only_fields = ['id',]


class RegisterSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all())
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'school']

    def create(self, validated_data):
        school_id = validated_data['school']
        found_school = School.objects.get(pk=school_id)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'], 
            role=validated_data['role'],
            school= found_school
        )
       
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")
