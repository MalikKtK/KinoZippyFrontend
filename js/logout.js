function logout() {
    // Remove all session storage
    if (sessionStorage.getItem("customer") != null) {
        sessionStorage.removeItem("customer");
    }

    if (sessionStorage.getItem("employee") != null) {
        sessionStorage.removeItem("employee");
    }

    // redirect to login page
    window.location.href = "http://localhost:63342/KinoZippyFrontend/html/login.html"
}