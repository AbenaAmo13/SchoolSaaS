from django.test import TestCase
from rest_framework.test import APITestCase
from core.models import ApplicationModules
from django.urls import reverse
from rest_framework import status
import json

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
            # Create the first school
        self.school_data = {
            "school": {
                "name": "ENAS Hybrid School",
                "email": "ehs12@gmail.com",
                "contact_number": "07983363040",
                "school_acronym": "EHS",
                "cambridge_certified": True,
                "modules":  ApplicationModules.objects.values_list('id', flat=True)[:2]
            },
            "user": {
                "username": "abenaadmin2",
                "password": "seates123",
                "role": "admin",
                "email": "ehs12@gmail.com",
                "is_staff": True
            }
        }


    
    def test_registry_school(self):
        url = reverse('register-school')
        self.client = self.client_class(HTTP_X_FORWARDED_PROTO='https')
        response = self.client.post(url, self.school_data, format="json")
        response_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # TOKEN VALUES
        self.assertTrue(len(response_data['access_token']) > 0)
        self.assertTrue(len(response_data['refresh_token']) > 0)

        # USER STRUCTURE + TYPE
        user = response_data['user']
        self.assertEqual(user['username'], "abenaadmin2")
        self.assertEqual(user['email'], 'ehs12@gmail.com')
        self.assertEqual(user['role'], 'admin')
        self.assertTrue(user['is_staff'])

        school = response_data['school']
    
    def test_duplicate_entries(self):
        self.client = self.client_class(HTTP_X_FORWARDED_PROTO='https')

        # First registration - should succeed
        first_response = self.client.post(reverse('register-school'), self.school_data, format='json')
        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)

        # Second registration - should fail due to duplication
        duplicate_response = self.client.post(reverse('register-school'), self.school_data, format='json')
        self.assertEqual(duplicate_response.status_code, status.HTTP_400_BAD_REQUEST)







    


