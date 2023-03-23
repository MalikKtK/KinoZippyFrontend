// login for customer
document.getElementById("formCustomer").addEventListener("submit", async function (event) {
    event.preventDefault(); // prevent form submission

    // get form data
    const username = document.getElementById("customerUsername").value;
    const password = document.getElementById("customerPassword").value;

    const response = await fetch("http://localhost:8080/customerLogin", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${username}&password=${password}`,
    });

    if (response.ok) {
        const customer = await response.json();
        sessionStorage.setItem("customer", JSON.stringify(customer));
        window.location.href =
            "http://localhost:63342/KinoZippyFrontend/html/index.html";
    } else {
        alert("Invalid username or password");
    }
});

// login for employee
// login for employee
document.getElementById("formEmployee").addEventListener("submit", async function (event) {
    event.preventDefault(); // prevent form submission

    // get form data
    const username = document.getElementById("employeeUsername").value;
    const password = document.getElementById("employeePassword").value;

    const response = await fetch("http://localhost:8080/employeeLogin", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${username}&password=${password}`,
    });

    if (response.ok) {
        const employee = await response.json();
        sessionStorage.setItem("employee", JSON.stringify(employee));

        // switch by role
        switch (employee.role) {
            case "MANAGER":
                window.location.href = "http://localhost:63342/KinoZippyFrontend/html/manager.html";
                break;
            case "SHOP_ASSISTANT":
                window.location.href = "http://localhost:63342/KinoZippyFrontend/html/shopManager.html";
                break;
            case "TICKET_INSPECTOR":
                window.location.href = "http://localhost:63342/KinoZippyFrontend/html/ticket.html";
                break;
            case "OPERATOR":
                window.location.href = "http://localhost:63342/KinoZippyFrontend/html/operator.html";
                break;
            default:
                alert("Invalid employee role");
        }
    } else {
        alert("Invalid username or password");
    }
});
