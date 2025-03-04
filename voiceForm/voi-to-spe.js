function speakLabel(fieldId) {
    // Get the input field
    let inputField = document.getElementById(fieldId);

    // Find the associated label
    let label = document.querySelector("label[for='" + inputField.id + "']");
    console.log(label);
    if (label) {
        let text = label.innerText;
        text = "Please speak your " + text
        let speech = new SpeechSynthesisUtterance(text);

        // Set voice properties for a natural sound
        speech.rate = 1;    // 1 = Normal speed (0.8-1.2 is best)
        speech.pitch = 1.2; // Slightly higher pitch for a natural effect
        speech.volume = 1;  // Full volume

        // Get available voices
        let voices = window.speechSynthesis.getVoices();

        // Select a high-quality voice (adjust based on your browser)
        speech.voice = voices.find(voice => voice.name.includes("Google US English")) || voices[0];

        // Speak the text
        window.speechSynthesis.speak(speech);
    } else {
        alert("No label found for this input!");
    }
}

// Load voices asynchronously (needed for some browsers)




function sanitizeString(input) {

    input = input.toLowerCase();

    input = input.replace(/at the rate/gi, "@");

    input = input.replace(/[^a-zA-Z0-9\-_.@]/g, "");

    input = input.replace(/\s+(?=\d)|(?<=\d)\s+/g, "");

    return input;
}

function startVoiceInput(fieldId) {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition.");
        return;
    }
    const test = document.getElementById(fieldId);
    let label = document.querySelector("label[for='" + test.id + "']");
    console.log(label)
    if (!label) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-IN'; // Set language to English

        recognition.start();
        recognition.onresult = (event) => {
            const check = document.getElementById(fieldId).type;

            if (check === 'email' || check === 'number' || check === 'tel') {
                document.getElementById(fieldId).value = sanitizeString(event.results[0][0].transcript);
            }
            else {
                document.getElementById(fieldId).value = event.results[0][0].transcript;
            }
        };

        recognition.onerror = (event) => {
            alert("Speech recognition error: " + event.error);
        };

    }
    else {
        speakLabel(fieldId)

        setTimeout(() => {

            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-IN'; // Set language to English

            recognition.start();
            recognition.onresult = (event) => {
                const check = document.getElementById(fieldId).type;

                if (check === 'email' || check === 'number' || check === 'tel') {
                    document.getElementById(fieldId).value = sanitizeString(event.results[0][0].transcript);
                }
                else {
                    document.getElementById(fieldId).value = event.results[0][0].transcript;
                }
            };

            recognition.onerror = (event) => {
                alert("Speech recognition error: " + event.error);
            };

        }, 2500);
    }
}

// function submitForm() {
//     const formElements = document.getElementById("bankingForm").elements;
//     let formData = "";
//     for (let i = 0; i < formElements.length; i++) {
//         if (formElements[i].type === "text") {
//             formData += `${formElements[i].previousElementSibling.textContent} ${formElements[i].value}\n`;
//         }
//     }
//     alert("Form Submitted:\n" + formData);
// }


function togglePassword() {
    const passwordField = document.getElementById('password');
    const togglePasswordIcon = document.getElementById('togglePasswordIcon');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        togglePasswordIcon.classList.remove('fa-eye');
        togglePasswordIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        togglePasswordIcon.classList.remove('fa-eye-slash');
        togglePasswordIcon.classList.add('fa-eye');
    }
}
