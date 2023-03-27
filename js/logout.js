function logout() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin' // This ensures that the session cookie is sent along with the request
    }).then(() => {
        // Redirect the user to the login page
        window.location.href = 'http://localhost:63342/KinoZippyFrontend/html/login.html';
    }).catch((err) => {
        // Handle any errors
        console.error('Logout failed:', err);
    });
}
