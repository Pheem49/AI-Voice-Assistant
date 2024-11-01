const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const transcriptionElement = document.getElementById("transcription");
const responseElement = document.getElementById("response");

let recognizing = false;
let speechRecognition;

// ฟังก์ชันสำหรับแสดงข้อความทีละตัวอักษร
function typeWriter(element, text, i = 0) {
    if (i < text.length) {
        element.textContent += text.charAt(i);
        setTimeout(() => typeWriter(element, text, i + 1), 30); // ปรับความเร็วตามต้องการ
    } else {
        element.classList.add("show"); // เพิ่มคลาสสำหรับอนิเมชันหลังจากพิมพ์เสร็จ
    }
}

// ฟังก์ชันสำหรับอัปเดตข้อความพร้อมแอนิเมชัน
function updateText(element, text) {
    element.classList.remove("show"); // เอาแอนิเมชันออกก่อน
    void element.offsetWidth; // รีเฟรชแอนิเมชัน
    element.textContent = ""; // เคลียร์ข้อความก่อน
    typeWriter(element, text); // เรียกใช้ฟังก์ชัน typeWriter
}



if ('webkitSpeechRecognition' in window && 'speechSynthesis' in window) {
    speechRecognition = new webkitSpeechRecognition();
    speechRecognition.continuous = true; // Allow continuous listening
    speechRecognition.interimResults = false; // Don't show interim results
    speechRecognition.lang = 'th-TH'; // Set to Thai language

    speechRecognition.onstart = () => {
        recognizing = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    speechRecognition.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        updateText(transcriptionElement, `You said: ${transcript}`); // ใช้ฟังก์ชัน updateText

        // Send the transcript to the server for AI response
        const response = await fetch('/api/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: transcript }),
        });

        const data = await response.json();
        updateText(responseElement, `AI response: ${data.response}`); // ใช้ฟังก์ชัน updateText

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
            speechRecognition.start(); // Restart listening
        }
    };

    startBtn.onclick = () => {
        if (!recognizing) {
            speechRecognition.start(); // Start recognition
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
