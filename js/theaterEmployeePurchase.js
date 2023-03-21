// TMP SESSION STORAGE
sessionStorage.setItem("user", {"id": 5, "username": "c1", "password": "123"});
sessionStorage.setItem("showTimeId", "1");

async function createTable() {
    let showTime = await getShowTimeInfo();

    const price = document.getElementById("price");
    price.innerText = `price: ${showTime.price} dkk`;

    const ddCategory = document.getElementById("ddCategory")

    function fillAgeLimitDropDown(ageLimit) {
        const el = document.createElement("option")
        el.textContent = ageLimit
        el.value = ageLimit
        ddAgeLimit.appendChild(el)
    }


    // Define the number of rows and columns
    const numRows = showTime.theater.rows;
    const numCols = showTime.theater.numberedSeats;

    // Define an array of disabled positions
    const tickets = await getShowTimeTickets();
    const disabledPositions = tickets.map(ticket => `${ticket.seatRow}_${ticket.seatNumber}`);

    getShowTimeTickets().then((tickets) => {
        console.log("tickets");
        console.log(JSON.stringify(tickets));
    });

    // Keep track of the currently selected button
    let selectedButton = null;

    // Create the table body
    const tableBody = document.getElementById("table_of_seats");

    // Button for seat selection
    let SelectedSeatButton = document.getElementById("select_seat_btn");

    SelectedSeatButton.addEventListener("click", () => {
        if (selectedButton) {
            const [seatRow, seatNumber] = selectedButton.id.split("_");
            postTicket(seatRow, seatNumber, showTime.id, showTime.price).then(() => {
                alert("Ticket purchased successfully");
                window.location.href = 'upcomingMovies.html';
            });
        } else {
            alert("Please select a seat");
        }
    });

    // Create the table rows and cells
    for (let i = 0; i < numRows; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement("td");
            const button = document.createElement("button");
            button.classList.add("btn");
            button.classList.add("btn-sm");
            // button.classList.add("btn-secondary");

            // Set the button ID to the cell position
            button.id = `${i + 1}_${j + 1}`;

            // Set the button label to the cell position
            button.innerText = `${i + 1}:${j + 1}`;

            // Disable the button if its position is in the disabledPositions array
            if (disabledPositions.includes(button.id)) {
                button.disabled = true;
                button.classList.add("btn-danger");
                button.type = "button";
            }

            // Add event listeners for hover and click
            button.addEventListener("mouseover", () => {
                button.classList.add("btn-primary");
            });

            button.addEventListener("mouseout", () => {
                button.classList.remove("btn-primary");
                if (selectedButton !== button) {
                    button.classList.remove("active");
                }
            });

            button.addEventListener("click", () => {
                if (selectedButton !== button) {
                    // If a different button is selected, remove the "btn-success" class from all buttons
                    const buttons = document.querySelectorAll(".btn");
                    buttons.forEach((btn) => {
                        btn.classList.remove("btn-success");
                        btn.classList.remove("active");
                    });
                    // Set the current button as selected and add the "btn-success" class
                    selectedButton = button;
                    button.classList.add("btn-success");
                    button.classList.add("active");
                } else {
                    // If the same button is selected, deselect it
                    selectedButton = null;
                    button.classList.remove("btn-success");
                }
            });

            cell.appendChild(button);
            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}

async function createCustomerDD() {
    const ddCustomer = document.getElementById("ddCustomer")

    const customers = await getCustomers();

    customers.forEach(customer => {
        const el = document.createElement("option")
        el.textContent = `[${customer.id}] : ${customer.username}`;
        el.value = customers.id;
        ddCustomer.appendChild(el)
    });
}

async function getCustomers() {
    // Send the GET request to the server
    return fetch('http://localhost:8080/customers')
        .then(response => response.json())  // Convert the response to JSON format
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function postTicket(seatRow, seatNumber, showTimeId, price) {
    const url = "http://localhost:8080/ticket";

    const ticket = {
        showTime: {
            id: showTimeId,
        },
        seatRow: parseInt(seatRow),
        seatNumber: parseInt(seatNumber),
        price: price,
        paid: true, // TODO remove?
        attended: false,
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(ticket),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to create ticket");
        }

        const data = await response.json();
    } catch (error) {
        console.error(error);
        alert("An error occurred while creating the ticket");
    }
}

async function getShowTimeInfo() {
    // Send the GET request to the server
    return fetch('http://localhost:8080/showtime/' + sessionStorage.getItem("showTimeId"))
        .then(response => response.json())  // Convert the response to JSON format
        .then(data => {
            console.log('Success:', data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function getShowTimeTickets() {
    // Send the GET request to the server
    return fetch('http://localhost:8080/tickets/showtime/' + sessionStorage.getItem("showTimeId"))
        .then(response => response.json())  // Convert the response to JSON format
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

createCustomerDD();
createTable();


