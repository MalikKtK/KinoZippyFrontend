function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // You can add a server-side authentication process here

    if (username === "admin" && password === "password") {
        alert("Login successful!");
        window.location.href = "index.html";

    } else {
        alert("Incorrect username or password.");
    }
}