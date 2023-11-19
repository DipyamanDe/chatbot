## Main
# from transformers import BertTokenizer, BertForSequenceClassification
# import torch
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from flask_cors import cross_origin
import psycopg2
import openai
import os


openai.api_key = "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"


app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

# CORS(app, resources={r"/chat": {"origins": "*"}})
def get_answers(out):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=out,
        temperature=0,
        max_tokens=600,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None
    )
    ansr = response.choices[0].message['content']
    # print("OpenAI API Response:", response) 
    return ansr


messages = [
    {"role": "user", "content": "What are the amenities provided by the hotel?"},
    {"role": "assistant", "content": "The hotel provides a range of amenities, including a pool, gym, spa, and complimentary breakfast."},
    {"role": "user", "content": "Can I check in early or late?"},
    {"role": "assistant", "content": "Early check-in and late check-out options are available upon request, subject to availability. Additional charges may apply."},
    
    {"role": "user", "content": "Are pets allowed in the hotel?"},
    {"role": "assistant", "content": "Yes, the hotel is pet-friendly. There may be an additional fee for bringing pets, so it's advisable to check with the hotel in advance."},
    
    {"role": "user", "content": "What types of rooms are available?"},
    {"role": "assistant", "content": "The hotel offers various room types, including standard rooms, suites, and executive rooms. Each room is equipped with modern amenities for your comfort."},
    
    {"role": "user", "content": "How far is the hotel from the airport?"},
    {"role": "assistant", "content": "The hotel is approximately 15 miles away from the airport. The exact travel time may vary depending on traffic conditions."},
    
    {"role": "user", "content": "Can I book a conference room for an event?"},
    {"role": "assistant", "content": "Certainly! The hotel has conference rooms available for events and meetings. You can contact our events team for more information on booking and availability."},
    
    {"role": "user", "content": "What restaurants are nearby the hotel?"},
    {"role": "assistant", "content": "There are several restaurants in the vicinity offering a variety of cuisines. The hotel's concierge can provide recommendations based on your preferences."},
    
    {"role": "user", "content": "Is there a shuttle service to the city center?"},
    {"role": "assistant", "content": "Yes, the hotel provides a shuttle service to the city center. The schedule and availability can be obtained at the front desk."},
    
    {"role": "user", "content": "Are there any special offers or discounts for long stays?"},
    {"role": "assistant", "content": "For extended stays, the hotel may offer special rates or packages. It's recommended to inquire with the reservations team for the most up-to-date information."},
    
    # Add more user and assistant interactions as needed for your specific use case
]


# @cross_origin(origin='http://localhost:3000')
@app.route("/chat", methods=["POST"])
def chat():

    try:
        user_message = request.get_json()["message"]
    except KeyError:
        return jsonify({"error": "Invalid request format"}), 400
    # user_message = input("User: ")

    system_message = {"role": "system", "content": "You are a concierge bot. Provide information related strictly to hotels, concierge services if the user input is related to some other topic please give a short response as a concierge bot"}
    messages.append(system_message)

    
    current_messages = messages.copy()  # Create a copy of the current conversation
    current_messages.append({"role": "user", "content": user_message})

    print("Current Messages:", current_messages)  # Add this print statement

    assistant_message = get_answers(current_messages)
    current_messages.append({"role": "assistant", "content": assistant_message})

    print("Assistant Message:", assistant_message)  # Add this print statement

    return jsonify({"assistant_message": assistant_message})

if __name__ == '__main__':
    app.run(debug=True,host='127.0.0.1', port=5000)