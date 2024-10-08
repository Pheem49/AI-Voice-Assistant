from flask import Flask, request, jsonify, render_template
import os
from dotenv import load_dotenv
import openai

load_dotenv()

app = Flask(__name__)

api_key = os.getenv("OPENAI_API_KEY")
print(f"API Key Loaded: {api_key}")  # Check the loaded API key


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/respond', methods=['POST'])
def respond():
    data = request.json
    prompt = data.get('prompt')

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=250,
            temperature=0.7,
        )
        ai_response = response.choices[0].message.content.strip()
        return jsonify({'response': ai_response})
    except Exception as e:
        print('Error with OpenAI API:', e)
        return jsonify({'response': "I'm sorry, I couldn't process your request."}), 500

if __name__ == '__main__':
    app.run(debug=True)
