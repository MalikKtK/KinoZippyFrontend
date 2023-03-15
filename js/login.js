function login() {
    // Get the username and password from the login form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check if the username and password are correct
    if (username === "manager" && password === "123") {
        // Redirect the user to the new HTML page
        window.location.href = "index.html";
    }
    else if (username === "shop" && password === "123") {
        window.location.href = "index.html";
    }
    else if (username === "operator" && password === "123") {
        window.location.href = "index.html";
    }
    else if (username === "ticket" && password === "123") {
        window.location.href = "index.html";
    }
    else {
        alert("Incorrect username or password.");
    }
}

fetch('http://localhost:8080/mywebapp/mymethod')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Process the data returned by the method
    })
    .catch(error => {
        console.error(error); // Handle any errors that occur
    });
