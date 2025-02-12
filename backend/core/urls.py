from django.urls import path
from .views import RegisterView, LoginView, CreateSchoolAndAdminView, ReloadTokens, CustomTokenRefreshView
from django.contrib import admin
from rest_framework_simplejwt.views import TokenObtainPairView




urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/school/', CreateSchoolAndAdminView.as_view(), name='register-school'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'), 
]

admin.site.site_header = 'Manage It Admin'

