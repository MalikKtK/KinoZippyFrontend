// TMP SESSION STORAGE
sessionStorage.setItem("user", {"id": 5, "username": "c1", "password": "123"});
sessionStorage.setItem("showTimeId", "1");

async function createTable() {
    let showTime = await getShowTimeInfo();

    // Define the number of rows and columns
    const numRows = showTime.theater.rows;
    const numCols = showTime.theater.numberedSeats;

    // Define an array of disabled positions
    const tickets = await getShowTimeTickets();

    getShowTimeTickets().then((tickets) => {
        console.log("tickets");
        console.log(JSON.stringify(tickets));
    });

    // Keep track of the currently selected button
    let selectedButton = null;

    // Create the table body
    const tableBody = document.getElementById("table_of_seats");

    // Create the table rows and cells
    for (let i = 0; i < numRows; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement("td");
            const button = document.createElement("button");
            button.classList.add("btn", "btn-sm");

            // Set the button ID to the cell position
            button.id = `${i + 1}_${j + 1}`;

            // Set the button label to the cell position
            button.innerText = `${i + 1}:${j + 1}`;

            cell.appendChild(button);
            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }

    // assign ticket status to seats
    for (let ticket of tickets) {
        // skip seats without ticket
        const ticketLocation = `${ticket.seatRow}_${ticket.seatNumber}`;
        console.log(ticketLocation);
        const button = document.getElementById(ticketLocation);
        if (button == null) {
            continue;
        }

        // assign seat status
        if (ticket.attended) {
            button.classList.add("btn-primary");
        } else {
            button.classList.add("btn-danger");
        }

        // add event listener
        button.addEventListener("click", () => {
            if (button.classList.contains("btn-primary")) {
                button.classList.remove("btn-primary");

                // update ticket status
                button.classList.add("btn-danger");
                putTicketStatus(false, button.id, tickets, showTime.id);
                console.log("ticket TRUE");
            } else {
                button.classList.remove("btn-danger");

                // update ticket status
                button.classList.add("btn-primary");
                putTicketStatus(true, button.id, tickets, showTime.id);
                console.log("ticket FALSE");
            }
        });

    }
}

async function putTicketStatus(status, ticketLocation, tickets, showTimeId) {
    // get ticket
    const [seatRow, seatNumber] = ticketLocation.split("_");
    let ticket = await tickets.find(ticket => ticket.seatRow == seatRow && seatNumber);

    const url = "http://localhost:8080/tickets/" + ticket.id;
    console.log(url);

    const postTicket = {
        id: ticket.id,
        showTime: {
            id: showTimeId,
        },
        seatRow: parseInt(seatRow),
        seatNumber: parseInt(seatNumber),
        price: ticket.price,
        paid: ticket.paid,
        attended: status,
    };

    try {
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(postTicket),
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

async function postTicket(ticket, showTimeId) {
    const url = "http://localhost:8080/ticket";

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

createTable();


