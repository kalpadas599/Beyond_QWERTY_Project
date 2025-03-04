
document.addEventListener("DOMContentLoaded", function () {
    const titleInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const addFieldButton = document.querySelector(".add-field"); 
    const previewContainer = document.querySelector(".preview");
    const submitButton = document.querySelector(".submit");
    let formFields = [];
    
    // Update form preview title and description in real time
    titleInput.addEventListener("input", updateFormPreview);
    descriptionInput.addEventListener("input", updateFormPreview);


    function updateFormPreview() {
        const previewTitle = document.getElementById("preview-title");
        const previewDescription = document.getElementById("preview-description");
    
        if (previewTitle) {
            previewTitle.textContent = document.getElementById("name").value || "Untitled Form";
        }
        if (previewDescription) {
            previewDescription.textContent = document.getElementById("description").value || "Form description...";
        }
    }
    

    // Add Field Button Event
    addFieldButton.addEventListener("click", function () {
        const fieldLabel = document.getElementById("new-field").value.trim();
        const fieldType = document.querySelector(".select-field").value;
        const placeholderValue = document.getElementById("enter-value").value.trim();
        
        if (!fieldLabel || !placeholderValue) {
            alert("Field Label and Placeholder Value are required.");
            return;
        }

        const fieldId = `field-${Date.now()}`;
        const fieldData = {
            id: fieldId,
            label: fieldLabel,
            type: fieldType,
            placeholder: placeholderValue
        };
        
        formFields.push(fieldData);
        renderFormPreview();
        
        // Clear Input Fields
        document.getElementById("new-field").value = "";
        document.getElementById("enter-value").value = "";
    });

    function renderFormPreview() {
        let previewFields = previewContainer.querySelectorAll(".preview-field");
        previewFields.forEach(field => field.remove());
    
        formFields.forEach(field => {
            const fieldElement = document.createElement("div");
            fieldElement.classList.add("relative", "mb-4", "preview-field");
            fieldElement.innerHTML = `
                <label class="block text-gray-700 mb-2">${field.label}</label>
                <div class="relative">
                    <input class="w-full p-2 border rounded pr-12" placeholder="${field.placeholder}" type="${field.type}" id="${field.id}"/>
                    <i class="fas fa-microphone absolute right-2 top-3 text-gray-500" onclick="startVoiceInput('${field.id}')"></i>
                </div>
            `;
            previewContainer.appendChild(fieldElement); // Append instead of insertBefore
        });
    }
    

    // Submit Form Button
    submitButton.addEventListener("click", function () {
        if (!titleInput.value.trim() || !descriptionInput.value.trim()) {
            alert("Form Title and Description are required.");
            return;
        }

        const formId = `form-${Date.now()}`;
        const newForm = {
            id: formId,
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            fields: formFields,
            link: `view-form.html?id=${formId}` // Placeholder for actual form view page
        };

        saveFormToLocal(newForm);
        alert("Form saved successfully!");
        location.reload(); // Refresh the page
    });

    function saveFormToLocal(form) {
        let storedForms = JSON.parse(localStorage.getItem("forms")) || [];
        storedForms.push(form);
        localStorage.setItem("forms", JSON.stringify(storedForms));

        updateFormList(form);
    }

    function updateFormList(form) {
        let cardContainer = document.querySelector("main.grid"); 
        let newCard = document.createElement("section");
        newCard.classList.add("bg-white", "p-6", "rounded-lg", "shadow-md");
        newCard.innerHTML = `
            <h3 class="text-lg font-semibold">${form.title}</h3>
            <p class="text-gray-600">${form.description}</p>
            <p>${form.fields.length} fields</p>
            <button class="px-4 py-2 bg-blue-500 text-white rounded mt-2" onclick="location.href='${form.link}'">Use Template →</button>
        `;
        cardContainer.appendChild(newCard);
    }

    // Load stored forms on page load
    function loadStoredForms() {
        let storedForms = JSON.parse(localStorage.getItem("forms")) || [];
        storedForms.forEach(updateFormList);
    }

    loadStoredForms();
});



// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Dynamic Form</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             margin: 20px;
//             padding: 20px;
//         }
//         form {
//             max-width: 400px;
//             margin: auto;
//             padding: 20px;
//             border: 1px solid #ccc;
//             border-radius: 5px;
//             background-color: #f9f9f9;
//         }
//         label, input {
//             display: block;
//             width: 100%;
//             margin-bottom: 10px;
//         }
//         button {
//             width: 100%;
//             padding: 10px;
//             background-color: blue;
//             color: white;
//             border: none;
//             cursor: pointer;
//         }
//         button:hover {
//             background-color: darkblue;
//         }
//     </style>
// </head>
// <body>

//     <script>
//         // Function to get URL parameters
//         function getQueryParam(param) {
//             const urlParams = new URLSearchParams(window.location.search);
//             return urlParams.get(param);
//         }

//         // Function to check if the page exists
//         function pageExists(url, callback) {
//             fetch(url, { method: 'HEAD' })
//                 .then(response => callback(response.ok))
//                 .catch(() => callback(false));
//         }

//         // Extract form ID from URL
//         const formId = getQueryParam("id");
//         if (!formId) {
//             document.body.innerHTML = "<h2>No form found!</h2>";
//             throw new Error("No form ID provided in URL.");
//         }

//         // Retrieve form data from local storage
//         const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
//         const formData = storedForms.find(form => form.id === formId);

//         if (!formData) {
//             document.body.innerHTML = "<h2>Form not found in local storage.</h2>";
//             throw new Error("Form not found in local storage.");
//         }

//         // Check if a webpage already exists
//         const existingPageUrl = formData.link;
//         pageExists(existingPageUrl, function (exists) {
//             if (exists) {
//                 // Redirect to the existing page
//                 window.location.href = existingPageUrl;
//             } else {
//                 // Create a new form dynamically
//                 document.title = formData.title;

//                 const formContainer = document.createElement("div");
//                 formContainer.innerHTML = `<h2>${formData.title}</h2>`;
                
//                 const formElement = document.createElement("form");
//                 formElement.setAttribute("id", formData.id);

//                 // Create form fields dynamically
//                 formData.fields.forEach(field => {
//                     const label = document.createElement("label");
//                     label.textContent = field.label;
//                     label.setAttribute("for", field.id);

//                     const input = document.createElement("input");
//                     input.setAttribute("type", field.type || "text");
//                     input.setAttribute("id", field.id);
//                     input.setAttribute("name", field.label);
//                     input.setAttribute("placeholder", field.placeholder || "");

//                     formElement.appendChild(label);
//                     formElement.appendChild(input);
//                 });

//                 // Add Submit Button
//                 const submitButton = document.createElement("button");
//                 submitButton.textContent = "Submit";
//                 submitButton.type = "submit";
//                 formElement.appendChild(submitButton);

//                 // Append the form to the body
//                 formContainer.appendChild(formElement);
//                 document.body.appendChild(formContainer);

//                 // Handle form submission
//                 formElement.addEventListener("submit", function (event) {
//                     event.preventDefault();
//                     alert("Form submitted successfully!");
//                 });
//             }
//         });
//     </script>

// </body>
// </html>
