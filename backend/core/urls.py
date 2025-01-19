from django.urls import path
from .views import RegisterView, LoginView, CreateSchool
from django.contrib import admin



urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/register/school/', CreateSchool.as_view(), name='register-school'),
    path('api/login/', LoginView.as_view(), name='login'),
]

admin.site.site_header = 'Manage It Admin'

