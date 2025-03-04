document.addEventListener("DOMContentLoaded", function () {
    const formData = JSON.parse(sessionStorage.getItem("formData")); // Retrieve stored form data

    if (formData) {
        createFormPage(formData); // Call function to create form
        sessionStorage.removeItem("formData"); // Clear stored data after use
    }
});

// Function to Create Form Dynamically
function createFormPage(formData) {
    document.title = formData.title;

    const formContainer = document.createElement("div");
    formContainer.innerHTML = `<h2>${formData.title}</h2>`;

    const formElement = document.createElement("form");
    formElement.setAttribute("id", formData.id);

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
        mic.addEventListener("click", () => startVoiceInput(field.id));

        
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

    formContainer.appendChild(formElement);
    document.body.appendChild(formContainer); // Append to body

    // Handle form submission
    formElement.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Form submitted successfully!");
    });
}
