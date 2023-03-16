const form = document.getElementById("contact-form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const message = document.getElementById("message");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendEmail(name.value, email.value, message.value);
});

function sendEmail(name, email, message) {
    Email.send({
        // Vi benytter ikke SecureToken, da vi har lavet en POST action i vores form
        SecureToken: "your_secure_token_here",
        To: "mark893b@stud.kea.dk",
        From: email,
        Subject: `New message from ${name}`,
        Body: message,
    }).then((message) => alert("Your message has been sent."));
}
