

function storeUserData(event) {
    event.preventDefault();  

    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill in all fields!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert("Email already exists! Please use another email.");
        return;
    }

    let newUser = {
        name: name,
        email: email,
        password: password,  
    };


   users.push(newUser);


    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");

    window.location.href = "signin.html";  
}
