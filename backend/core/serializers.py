from rest_framework import serializers
from .models import School, User, ApplicationModules
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group

class ApplicationModulesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationModules
        fields = '__all__'    
class UserSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), required=False, allow_null=True)
    password = serializers.CharField(write_only=True)  # Add password field, write_only so it doesn't get exposed
    is_staff = serializers.BooleanField(required=False, default=False)  # Handle is_staff explicitly

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'school', 'role', 'password', 'is_staff']
        read_only_fields=['id']



class SchoolSerializer(serializers.ModelSerializer):
    modules = serializers.PrimaryKeyRelatedField(queryset=ApplicationModules.objects.all(), many=True)

    class Meta:
        model = School
        fields = ['id', 'modules', 'name', 'contact_number', 'email', 'cambridge_certified', 'license_activation_date',  'school_acronym']
        read_only_fields = ['id',]

class CreateSchoolAndAdminSerializer(serializers.Serializer):
    school = SchoolSerializer()
    user = UserSerializer()

    def create(self, validated_data):
        print(str(validated_data) + '\n')
        modules = self.initial_data.get('school').get('modules', None)
        # Extract school and user data from validated data
        school_data = validated_data.pop('school')
        user_data = validated_data.pop('user')

        # Create the school object first (without setting modules)
        modules = school_data.pop('modules') if 'modules' in school_data else None
        school = School.objects.create(**school_data)
        # Set the modules for the school if provided
        if modules:
            school.modules.set(modules)  # Use set() to add modules after the school is created
        # Create the user, associating it with the created school
        user_data['school'] = school
        user = User.objects.create_user(**user_data)

        return {'school': school, 'user': user}

class RegisterSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all())
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'school']

    def create(self, validated_data):
        school = validated_data['school']
        #found_school = School.objects.get(pk=school_id)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'], 
            role=validated_data['role'],
            school= school
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
