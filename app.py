from flask import Flask, request, jsonify
from flask_cors import CORS
import azure.cognitiveservices.speech as speechsdk
import speech_recognition as sr
import openai

subscription_key = "7f3f190f4ddd4273989358d304df47d7"
region = "centralindia"
openai.api_key = "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"
app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

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
    return ansr

def transcribe_audio(file_path, subscription_key, region):
    try:
        speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=region)
        audio_config = speechsdk.AudioConfig(filename=file_path)
        speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

        result = speech_recognizer.recognize_once()

        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            return result.text
        else:
            return "Speech recognition failed"

    except Exception as e:
        return f"Error in transcribe_audio: {str(e)}"

def text_to_speech(text, subscription_key, region, output_file_path='output.wav'):
    try:
        speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=region)
        synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)

        result = synthesizer.speak_text(text)
        result.write_to_wav_file(output_file_path)

        return output_file_path
    except Exception as e:
        return f"Error in text_to_speech: {str(e)}"
    
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data['message']
        messages = [{"role": "user", "content": "What are the amenities provided by the hotel?"},
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
    {"role": "assistant", "content": "For extended stays, the hotel may offer special rates or packages. It's recommended to inquire with the reservations team for the most up-to-date information."},]

        if user_message.lower().endswith(('.wav', '.mp3', '.flac')):
            audio_text = transcribe_audio(user_message, subscription_key, region)
            assistant_input = {"role": "user", "content": audio_text}
            system_message = {"role": "system", "content": "You are a concierge bot. Provide information related strictly to hotels, concierge services. If the user input is related to some other topic, please give a short response as a concierge bot."}
            messages.extend([
                system_message,
                assistant_input,
            ])
        else:
            system_message = {"role": "system", "content": "You are a concierge bot. Provide information related strictly to hotels, concierge services. If the user input is related to some other topic, please give a short response as a concierge bot."}
            messages.extend([
                system_message,
                {"role": "user", "content": user_message},
            ])

        assistant_message = get_answers(messages)
         # Convert the assistant's response to voice
        audio_output_path = text_to_speech(assistant_message, subscription_key, region)

        messages.append({"role": "assistant", "content": assistant_message, "audio": audio_output_path})
        print("messages: -> :", messages)
        return jsonify({"assistant_message": assistant_message, "audio_output_path": audio_output_path})    


    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
