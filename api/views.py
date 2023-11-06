import openai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import json
import concurrent.futures
import time
# Move the OpenAI API key setup outside of the function for better performance.
openai.api_key = os.getenv('OPENAI_KEY')

# Define a system message that introduces the chatbot.
SYSTEM_MESSAGE = "you are an data analysis bot capable of responding to user queries by providing relevant information from a provided dataset. When a user asks a question, you will search for related data within the dataset and utilize that information to create a helpful response."


@csrf_exempt
def user_input(request):
    print("Received a user input request.")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            if 'csv_data' in data and 'user_input_message' in data:
                # Construct the conversation input by including the system message and user input.
                user_message = "Tabel dataset: \n\n" + data['csv_data'].replace(
                    "\r", "") + '\nUser query: ' + data['user_input_message']
                conversation = [
                    {"role": "system", "content": SYSTEM_MESSAGE},
                    {"role": "user", "content": user_message}
                ]
                print(user_message)
                # ai_output = get_ai_response(conversation)
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    # Default message if no response is received
                    ai_output = "Timed out please try again"
                    try:
                        ai_output = executor.submit(
                            get_ai_response, conversation).result(timeout=40)
                    except concurrent.futures.TimeoutError:
                        pass
                response_data = {
                    'answer': ai_output,
                }
                print("Response sent.", response_data)
                return JsonResponse(response_data)
            else:
                # Handle the case when required JSON data fields are missing.
                response_data = {
                    'error': 'Both "csv_data" and "user_input_message" are required in the JSON data.'
                }
                print("Invalid JSON data: Missing required fields.")
                return JsonResponse(response_data, status=400)
        except json.JSONDecodeError:
            # Handle JSON decoding error.
            response_data = {
                'error': 'Invalid JSON data'
            }
            print("Invalid JSON data: JSON decoding error.")
            return JsonResponse(response_data, status=400)
        except Exception as e:
            # Handle unexpected errors and provide detailed error message.
            response_data = {
                'error': f'An unexpected error occurred: {str(e)}'
            }
            print(f"Unexpected error: {str(e)}")
            return JsonResponse(response_data, status=500)
    else:
        # Handle the case when the request method is not POST.
        response_data = {
            'error': 'Invalid request method'
        }
        print("Invalid request method: Must be a POST request.")
        return JsonResponse(response_data, status=400)


def get_ai_response(conversation):
    print("Received a request to get AI response.")
    try:
        # Use the provided conversation in the OpenAI API request.
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=conversation
        )
        response_text = completion.choices[0].message["content"]
        # time.sleep(3)
        # response_text = "hi how can i help you.."
        print("AI response received.")
        return response_text
    except openai.error.OpenAIError as e:
        # Handle OpenAI API errors and provide specific error message.
        response_data = {
            'error': f'OpenAI API error: {str(e)}'
        }
        print(f"OpenAI API error: {str(e)}")
        return response_data
