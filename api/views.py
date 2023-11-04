import openai
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import json


def get_ai_response(user_input):
    print(user_input)
    # openai.api_key = os.getenv('OPENAI_KEY')
    # completion = openai.ChatCompletion.create(
    #     model="gpt-3.5-turbo",
    #     messages=[
    #         {"role": "system", "content": f"You are a chatbot developed by Dev Namdev named 'Chatbot'."},
    #         {"role": "user", "content": user_input},
    #     ]
    # )
    # response_text = completion.choices[0].message["content"]
    # return response_text
    return "hii how can i help you"


@csrf_exempt
def user_input(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            if 'csv_data' in data and 'user_input_message' in data:
                ai_input = data['csv_data'] + '\n' + data['user_input_message']
                ai_output = get_ai_response(ai_input)

                response_data = {
                    'answer': ai_output,
                }
                return JsonResponse(response_data)
            else:
                response_data = {
                    'error': 'Both "csv_data" and "user_input_message" are required in the JSON data.'
                }
                return JsonResponse(response_data, status=400)
        except json.JSONDecodeError:
            response_data = {
                'error': 'Invalid JSON data'
            }
            return JsonResponse(response_data, status=400)
    else:
        response_data = {
            'error': 'Invalid request method'
        }
        return JsonResponse(response_data, status=400)
