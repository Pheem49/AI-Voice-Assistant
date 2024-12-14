class SpeechAssistant {
    constructor(transcriptionElement, responseElement) {
        this.transcriptionElement = transcriptionElement;
        this.responseElement = responseElement;
        this.recognizing = false;
        this.initRecognition();
    }

    initRecognition() {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Your browser does not support the Web Speech API.");
            return;
        }

        this.speechRecognition = new webkitSpeechRecognition();
        this.speechRecognition.continuous = true;
        this.speechRecognition.interimResults = false;
        this.speechRecognition.lang = 'th-TH';

        this.speechRecognition.onstart = () => this.onStart();
        this.speechRecognition.onresult = (event) => this.onResult(event);
        this.speechRecognition.onend = () => this.onEnd();
        this.speechRecognition.onerror = (event) => this.onError(event);
    }

    start() {
        if (!this.recognizing) {
            this.speechRecognition.start();
        }
    }

    stop() {
        if (this.recognizing) {
            this.speechRecognition.stop();
            this.recognizing = false;
        }
    }

    onStart() {
        this.recognizing = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
    }

    async onResult(event) {
        const transcript = event.results[event.results.length - 1][0].transcript;
        this.animateText(this.transcriptionElement, `You said: ${transcript}`);

        try {
            const response = await fetch('/api/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: transcript }),
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            this.animateText(this.responseElement, `AI response: ${data.response}`);

            const utterance = new SpeechSynthesisUtterance(data.response);
            utterance.lang = 'th-TH';
            utterance.onend = () => this.speechRecognition.start();
            window.speechSynthesis.speak(utterance);

        } catch (error) {
            console.error("Error:", error);
            this.animateText(this.responseElement, "An error occurred while processing your request.");
        }
    }

    onEnd() {
        if (this.recognizing) {
            this.speechRecognition.start();
        }
    }

    onError(event) {
        console.error("Speech Recognition Error:", event.error);
        this.animateText(this.responseElement, "An error occurred with speech recognition.");
    }

    animateText(element, text, speed = 30) {
        element.textContent = "";
        let i = 0;

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.add("show");
            }
        };
        type();
    }
}

// DOM Elements
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const transcriptionElement = document.getElementById("transcription");
const responseElement = document.getElementById("response");

// Initialize Speech Assistant
const assistant = new SpeechAssistant(transcriptionElement, responseElement);

// Button Event Listeners
startBtn.onclick = () => assistant.start();
stopBtn.onclick = () => assistant.stop();
