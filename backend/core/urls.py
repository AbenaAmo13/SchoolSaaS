from django.urls import path
from .views import RegisterView, LoginView, CreateSchoolAndAdminView, ReloadTokens, CustomTokenRefreshView
from django.contrib import admin
from rest_framework_simplejwt.views import TokenObtainPairView




urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('school/', CreateSchoolAndAdminView.as_view(), name='register-school'),
    path('login/', LoginView.as_view(), name='login'),
    path('oken/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'), 
]

admin.site.site_header = 'Manage It Admin'

