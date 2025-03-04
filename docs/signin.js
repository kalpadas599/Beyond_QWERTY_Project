
function checkCredentials(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || []; // Retrieve the users array

    if (users.length === 0) {
        console.log("No users found in localStorage.");
        return false;
    }

    // Check if the entered credentials match any stored user
    const validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        console.log("Login successful for:", validUser.email);
        return true;
    } else {
        console.log("Invalid email or password.");
        return false;
    }
}

function handleSignIn(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    console.log("Entered Email:", email, "Entered Password:", password);

    if (checkCredentials(email, password)) {
        alert("Login successful!");
        window.location.href = 'home.html'; // Redirect to home page
    } else {
        alert('Invalid email or password');
    }
}
