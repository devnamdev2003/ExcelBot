import json
from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch
from api.views import get_ai_response  # Import your view functions

class ExcelBotTest(TestCase):
    def test_valid_user_input(self):
        # Define a valid user input in JSON format.
        valid_input = {
            'csv_data': 'your_csv_data_here',
            'user_input_message': 'your_user_input_message_here',
        }

        # Use the reverse function to get the URL for your view.
        url = reverse('user_input')  # Replace 'user_input' with the actual view name.

        # Mock the get_ai_response function to avoid external API calls.
        with patch('api.views.get_ai_response', return_value='Your expected response'):
            # Send a POST request with valid user input data.
            response = self.client.post(url, json.dumps(valid_input), content_type='application/json')

        # Check if the response status code is 200 (OK).
        self.assertEqual(response.status_code, 200)

        # Check if the response contains the expected response content.

    def test_missing_required_fields(self):
        # Define invalid user input with missing fields.
        invalid_input = {
            'csv_data': 'your_csv_data_here',
            # 'user_input_message': 'your_user_input_message_here',  # Commenting out a required field.
        }


        # Use the reverse function to get the URL for your view.
        url = reverse('user_input')  # Replace 'user_input' with the actual view name.

        # Send a POST request with invalid user input data.
        response = self.client.post(url, json.dumps(invalid_input), content_type='application/json')

        # Check if the response status code is 400 (Bad Request) because of missing fields.
        self.assertEqual(response.status_code, 400)

        # Check if the response contains the expected error message.

    # Add more test cases as needed to cover different scenarios.

