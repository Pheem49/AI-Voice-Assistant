const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const transcriptionElement = document.getElementById("transcription");
const responseElement = document.getElementById("response");

let recognizing = false;
let speechRecognition;

if ('webkitSpeechRecognition' in window && 'speechSynthesis' in window) {
    speechRecognition = new webkitSpeechRecognition();
    speechRecognition.continuous = true;  // Allow continuous listening
    speechRecognition.interimResults = false; // Don't show interim results
    speechRecognition.lang = 'th-TH'; // Set to Thai language

    speechRecognition.onstart = () => {
        recognizing = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    speechRecognition.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        transcriptionElement.textContent = `You said: ${transcript}`;

        // Send the transcript to the server for AI response
        const response = await fetch('/api/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: transcript }),
        });

        const data = await response.json();
        responseElement.textContent = `AI response: ${data.response}`;

        // Use the Web Speech API for AI Text-to-Speech
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.lang = 'th-TH';  // Set language to Thai
        utterance.onend = () => {
            // Automatically start listening again after AI response
            speechRecognition.start();
        };
        window.speechSynthesis.speak(utterance);
    };

    speechRecognition.onend = () => {
        if (recognizing) {
            speechRecognition.start();  // Restart listening
        }
    };

    startBtn.onclick = () => {
        if (!recognizing) {
            speechRecognition.start();  // Start recognition
        }
    };

    stopBtn.onclick = () => {
        if (recognizing) {
            speechRecognition.stop();
            recognizing = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    };
} else {
    alert("Your browser does not support the Web Speech API.");
}
