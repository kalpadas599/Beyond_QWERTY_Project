document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.querySelector(".grid");
    const cards = [
        {
            id: "bank-form",
            title: "Bank Account Opening Form",
            description: "Basic contact form with name, email, and message fields",
            fields: "2 fields",
            link: "bank-form.html"
        },
        {
            id: "job-form",
            title: "Job Application Form",
            description: "Standard job application form with personal and professional details",
            fields: "2 fields",
            link: "job-form.html"
        }
    ];


    function saveFormToLocal(form) {
        let storedForms = JSON.parse(localStorage.getItem("forms")) || [];
    
        // Check if the form already exists in localStorage
        const formExists = storedForms.some(storedForm => storedForm.id === form.id);
        
        if (!formExists) {
            storedForms.push(form);
            localStorage.setItem("forms", JSON.stringify(storedForms));
        }
    }
    


    cards.forEach(element => {
        saveFormToLocal(element);
    });

    function renderCards() {
        gridContainer.innerHTML = "";
        let storedForms = JSON.parse(localStorage.getItem("forms")) || [];
        storedForms.forEach(card => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");
            cardElement.id = card.id;
            cardElement.innerHTML = `
                <h2>${card.title}</h2>
                <p>${card.description}</p>
                <p>${card.fields.length}</p>
                <div class="actions">
                    <div class="icons">
                        
                        <button onclick="deleteTemplate('${card.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                    <button class="use-template view-form-button" >
                        Use Template
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
            gridContainer.appendChild(cardElement);
        });
    }

    window.addCard = function () {
        const newCardId = `card-${Date.now()}`;
        cards.push({
            id: newCardId,
            title: "New Custom Form",
            description: "A dynamically added form template.",
            fields: "3 fields",
            link: "#"
        });
        renderCards();
    }

    // window.deleteTemplate = function (id) {
    //     const index = cards.findIndex(card => card.id === id);
    //     if (index !== -1) {
    //         cards.splice(index, 1);
    //         renderCards();
    //     }
    // }

    window.deleteTemplate = function (id) {
        console.log("Deleting card with ID:", id);
        
        // Get stored forms from local storage
        let storedForms = JSON.parse(localStorage.getItem("forms")) || [];
    
        // Find the index of the card in local storage
        const index = storedForms.findIndex(card => card.id === id);
    
        if (index !== -1) {
            // Remove the card from local storage array
            storedForms.splice(index, 1);
    
            // Update local storage
            localStorage.setItem("forms", JSON.stringify(storedForms));
    
            // Remove the card element from the DOM
            const cardElement = document.getElementById(id);
            if (cardElement) {
                cardElement.remove();
            }
    
            console.log("Card removed successfully!");
        } else {
            console.log("Card not found in local storage.");
        }
    };
    
    

    renderCards();
});


function editTemplate(templateId) {
    const template = document.getElementById(templateId);
    const title = template.querySelector('h2').innerText;
    const description = template.querySelector('p').innerText;

    const newTitle = prompt("Edit Title:", title);
    const newDescription = prompt("Edit Description:", description);

    if (newTitle !== null) {
        template.querySelector('h2').innerText = newTitle;
    }
    if (newDescription !== null) {
        template.querySelector('p').innerText = newDescription;
    }
}

// function deleteTemplate(templateId) {
//     const template = document.getElementById(templateId);
//     template.remove();
// }


function startSpeechSelection() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log("Recognized speech:", transcript);

        // Find all form cards dynamically
        const forms = document.querySelectorAll(".card");
        let matchedForm = null;

        forms.forEach((form) => {
            const formTitle = form.querySelector("h2").innerText.toLowerCase();
            if (transcript.includes(formTitle)) {
                matchedForm = form;
            }
        });

        if (matchedForm) {
            // Navigate to the corresponding form
            const formLink = matchedForm.querySelector(".use-template").getAttribute("onclick");
            eval(formLink); // Simulates the button click
        } else {
            alert("No matching form found. Please try again.");
        }
    };

    recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
        alert("Could not recognize speech. Please try again.");
    };
}





// function handleFormPageNavigation(formId) {
//     if (!formId) {
//         alert("No form ID provided!");
//         return;
//     }

//     // Retrieve form data from local storage
//     const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
//     const formData = storedForms.find(form => form.id === formId);

//     if (!formData) {
//         alert("Form not found in local storage.");
//         return;
//     }

//     const existingPageUrl = formData.link;

//     // Check if page exists
//     fetch(existingPageUrl, { method: 'HEAD' })
//         .then(response => {
//             if (response.ok) {
//                 // Redirect to existing page
//                 window.location.href = existingPageUrl;
//             } else {
//                 // Create the form dynamically
//                 window.location.href = 'allform.html';
//                 createFormPage(formData,'allform.html');
//             }
//         })
//         .catch(() => {
//             window.location.href = 'allform.html';
//             // If the page check fails, create the form
//             createFormPage(formData,'allform.html');
//         });
// }

function handleFormPageNavigation(formId) {
    if (!formId) {
        alert("No form ID provided!");
        return;
    }

    // Retrieve form data from local storage
    const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
    const formData = storedForms.find(form => form.id === formId);

    if (!formData) {
        alert("Form not found in local storage.");
        return;
    }

    const existingPageUrl = formData.link;

    // Check if page exists
    fetch(existingPageUrl)
        .then(response => {
            if (response.ok) {
                window.location.href = existingPageUrl; // Redirect to existing page
            } else {
                sessionStorage.setItem("formData", JSON.stringify(formData)); // Store form data temporarily
                window.location.href = "allform.html"; // Redirect to allform.html
            }
        })
        .catch(() => {
            sessionStorage.setItem("formData", JSON.stringify(formData)); // Store form data temporarily
            window.location.href = "allform.html"; // Redirect if fetch fails
        });
}


// Function to create form dynamically
function createFormPage(formData, link) {
    document.title = formData.title;

    const formContainer = document.createElement("div");
    formContainer.innerHTML = `<h2>${formData.title}</h2>`;

    const formElement = document.createElement("form");
    formElement.setAttribute("id", formData.id);

    // Create form fields dynamically
    formData.fields.forEach(field => {
        const new_div = document.createElement("div");
        new_div.classList.add("new-div");    
        const label = document.createElement("label");
        label.textContent = field.label;
        label.setAttribute("for", field.id);

        const input = document.createElement("input");
        input.setAttribute("type", field.type || "text");
        input.setAttribute("id", field.id);
        input.setAttribute("name", field.label);
        input.setAttribute("placeholder", field.placeholder || "");
        const mic = document.createElement("i");
        mic.classList.add("fas", "fa-microphone");
        mic.addEventListener("click", startSpeechSelection(field.id));
        
        new_div.appendChild(label);
        new_div.appendChild(input);
        new_div.appendChild(mic);
        formElement.appendChild(new_div);
    });

    // Add Submit Button
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.type = "submit";
    formElement.appendChild(submitButton);

    // Append the form to the body
    formContainer.appendChild(formElement);
    const body = document.getElementById('body');
    console.log(body);
    body.getElementById('body').appendChild(formContainer);
    

    // Handle form submission
    formElement.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Form submitted successfully!");
    });
}

// Button Click Event to Call the Function
document.addEventListener("DOMContentLoaded", function () {
    const viewButtons = document.querySelectorAll(".view-form-button");
    console.log("viewButtons is not selected");
    viewButtons.forEach(button => {
        button.addEventListener("click", function () {
            const card = this.closest(".card"); // Get the closest parent with class 'card'
            if (card) {
                const formId = card.id; // Get the form ID
                console.log("Form ID:", formId); // Debugging
                handleFormPageNavigation(formId);
            }
            
        });
    });
});


{/* <button><i class="fas fa-edit"></i></button> */}