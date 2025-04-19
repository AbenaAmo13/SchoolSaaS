from django.test import TestCase
from rest_framework.test import APITestCase
from core.models import ApplicationModules
from django.urls import reverse
from rest_framework import status

# Create your tests here.
class RegisterSchoolTest(APITestCase):
    def setUp(self):
        modules = [
            ApplicationModules(name="Reporting"),
            ApplicationModules(name="Billing"),
        ]
        ApplicationModules.objects.bulk_create(modules)
        # Use bulk_create to add all employees at once
        self.modules= ApplicationModules.objects.values_list('id', flat=True)[:2]


    
    def test_registry_school(self):
        url = reverse('register-school')
        print(self.modules)
        data={
            "school": {
                "name": "ENAS Hybrid School",
                "email": "ehs12@gmail.com",
                "contact_number": "07983363040",
                "school_acronym": "EHS",
                "cambridge_certified": "on",
                "modules": list(self.modules)
            },
            "user": {
                "username": "abenaadmin2",
                "password": "seates123",
                "role": "admin",
                "email": "ehs12@gmail.com",
                "is_staff": True
            }
        }
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    


