from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User,School

class SchoolAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        # Superuser sees all users, but other users only see their school’s users
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(id=request.user.school.id)
    list_display = ('id', 'name', 'email', 'contact_number', 'school_acronym', 'all_modules')
    filter_horizontal = ('modules',)  # Add this line to make the many-to-many field more user-friendly
    
    def all_modules(self, obj):
        # Retrieve and display the names of associated groups
        group_names = [group.name for group in obj.modules.all()]
        return ", ".join(group_names)  # Join group names by commas

class CustomUserAdmin(UserAdmin):
    def get_queryset(self, request):
        # Superuser sees all users, but other school admin user's only see their school’s users
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(school=request.user.school)
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'school')
        
    def school(self, obj):
        return ", ".join([school.name for school in obj.school.all()]) 
    fieldsets = [
        (
            None,
            {
                "fields": ["username", "email", "password", "role", "school"],
            },
        ),
         (
            "Permissions",
            {
                "fields": ["is_staff", "is_active", "is_superuser", "user_permissions"],
            },
        ),

        (
            "Date Joined",
            {
                "fields": ["last_login", "date_joined"],
            },
        ),
       
       
    ]

admin.site.register(School, SchoolAdmin)
admin.site.register(User, CustomUserAdmin)

