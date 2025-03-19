class SpeechAssistant {
    constructor(transcriptionElement, responseElement, userWaveform, aiWaveform) {
        this.transcriptionElement = transcriptionElement;
        this.responseElement = responseElement;
        this.userWaveform = userWaveform;
        this.aiWaveform = aiWaveform;
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
            this.toggleWaveform(this.userWaveform, true);
        }
    }

    stop() {
        if (this.recognizing) {
            this.speechRecognition.stop();
            this.recognizing = false;
            this.toggleWaveform(this.userWaveform, false);
            startBtn.disabled = false;
            stopBtn.disabled = true;
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
        this.toggleWaveform(this.userWaveform, false);

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
            utterance.voice = window.speechSynthesis.getVoices().find(voice => voice.name.includes("Google ไทย")) || null;
            utterance.onstart = () => this.toggleWaveform(this.aiWaveform, true);
            utterance.onend = () => {
                this.toggleWaveform(this.aiWaveform, false);
                this.speechRecognition.start();
            };
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error("Error:", error);
            this.animateText(this.responseElement, "An error occurred while processing your request.");
        }
    }

    onEnd() {
        if (this.recognizing) {
            console.log("Recognition ended, restarting...");
            this.speechRecognition.start();
        }
    }

    onError(event) {
        console.error("Speech Recognition Error:", event.error);
        this.animateText(this.responseElement, "An error occurred with speech recognition.");
    }

    animateText(element, text, speed = 30) {
        if (!element) return;
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

    toggleWaveform(element, active) {
        if (active) {
            element.style.opacity = "1";
            element.style.animation = "wave-animation 1s infinite linear";
        } else {
            element.style.opacity = "0";
            element.style.animation = "none";
        }
    }
}

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const transcriptionElement = document.getElementById("transcription");
const responseElement = document.getElementById("response");
const userWaveform = document.getElementById("user-waveform");
const aiWaveform = document.getElementById("ai-waveform");

if (!startBtn || !stopBtn || !transcriptionElement || !responseElement || !userWaveform || !aiWaveform) {
    console.error("One or more DOM elements are missing.");
    alert("Some necessary elements are missing. Please check the HTML structure.");
} else {
    const assistant = new SpeechAssistant(transcriptionElement, responseElement, userWaveform, aiWaveform);
    startBtn.onclick = () => assistant.start();
    stopBtn.onclick = () => assistant.stop();
}
