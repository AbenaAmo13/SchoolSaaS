from django.urls import path
from .views import RegisterView, LoginView, CreateSchool
from django.contrib import admin
from rest_framework.authtoken import views


urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/register/school/', CreateSchool.as_view(), name='register-school'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api-token-auth/', views.obtain_auth_token)
]

admin.site.site_header = 'Manage It Admin'

