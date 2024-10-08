# How to use [ AI-Voice-Assistant ](https://github.com/Pheem49/AI-Voice-Assistant)

## Overview
The website will:
 - Have a front-end for voice input.
 - Use Flask to handle the backend requests to OpenAI's API.
 - Continuous Listening: The assistant will keep listening after responding to you.
 - Text-to-Speech: After generating a response, the assistant will read it aloud using the browser’s SpeechSynthesis API.
## Project Structure
Create the following directory structure for your project:
```text
voice_assistant_flask/
├── static/ 
│         ├── styles.css
│         └── script.js 
├── templates/ 
│ └── index.html 
├── app.py 
└── .env
```
## Install Python

Download Python songs on each [ Python official website ](https://www.python.org/downloads/) and download the latest movies in OpenAI's Python library. Literature has Python 3.7.1 and above with Python.
## Install the Python library

**Install Required Packages**: Make sure you have Flask and the OpenAI library installed. You can install them using pip:

```text
pip install Flask openai python-dotenv
```

Once this completes, running  `pip list`  will show you the Python libraries you have installed in your current environment, which should confirm that the OpenAI Python library was successfully installed.

## Set up your API key for a single project
If you only want your API key to be accessible to a single project, you can create a local  `.env`  file which contains the API key and then explicitly use that API key with the Python code shown in the steps to come.

Start by going to the project folder you want to create the  `.env`  file in.

In order for your  **.env**  file to be ignored by version control, create a  **.gitignore**  file in the root of your project directory. Add a line with  **.env**  on it which will make sure your API key or other secrets are not accidentally shared via version control.

Once you create the  `.gitignore`  and  `.env`  files using the terminal or an integrated development environment (IDE), copy your secret API key and set it as the  `OPENAI_API_KEY`  in your  `.env`  file. If you haven't created a secret key yet, you can do so on the  [API key page](https://platform.openai.com/account/api-keys).

Create a `.env` file
```text
# Once you add your API key below, make sure to not share it with anyone! The API key should remain private.

OPENAI_API_KEY="your-api-key-here"
```

## Run the Flask Server

**Run the Flask Server**: Start your Flask server:

```text
python app.py
```
Open the Website: Open your web browser and navigate to http://127.0.0.1:5000. You should see your voice assistant website.


## Usage

Start the Application: Run your Flask application with
 ```text
python app.py
```
Open the Browser: Navigate to http://127.0.0.1:5000.

**Interaction:**
Click "**Start Listening**" to begin the interaction.
Speak to the assistant, and it will respond aloud and continue listening.
Click "**Stop Listening**" to end the conversation.