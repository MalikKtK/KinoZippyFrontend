function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // You can add a server-side authentication process here

    if (username === "manager" && password === "123") {
        alert("Login successful!");
    window.location.href = "index.html"; }

    else if (username === "operator" && password === "123") {
        alert("Login successful!");
        window.location.href = "index.html"; }

    else if (username === "shop" && password === "123") {
        alert("Login successful!");
        window.location.href = "index.html"; }

    else if (username === "ticket" && password === "123") {
        alert("Login successful!");
        window.location.href = "index.html"; }

    else {
        alert("Incorrect username or password.");
    }
}