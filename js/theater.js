const table = document.querySelector("#table_of_seats");

// Define the number of rows and columns
async function createTheaterTable() {
    let theater = await getTheaterSeatInfo();
    let numRows = theater.seatRow;
    let numCols = theater.seatNumber;

    // Loop through the rows and create the table cells
    for (let i = 1; i <= numRows; i++) {
        // Create a new row element
        const row = document.createElement("tr");

        // Loop through the columns and create the table cells
        for (let j = 1; j <= numCols; j++) {
            // Create a new cell element
            const cell = document.createElement("td");

            // Set the cell's text content to the row and column number
            // cell.textContent = `[${i}-${j}]`;
            cell.textContent = '[' + String(i).padStart(2, ' ') + '-' + String(j).padStart(2, ' ') + ']';

            // Append the cell to the row
            row.appendChild(cell);
        }

        // Append the row to the table
        table.appendChild(row);
    }
}

async function getTheaterSeatInfo() {
    // Send the GET request to the server
    return fetch('http://localhost:8080/theater/1')
        .then(response => response.json())  // Convert the response to JSON format
        .then(data => {
            // Read the seatRow and seatNumber values from the response data
            const seatRow = data.seatRow;
            const seatNumber = data.seatNumber;

            // Return the seatRow and seatNumber values as an object
            return {
                seatRow: seatRow,
                seatNumber: seatNumber
            };
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Call the createTheaterTable function to create the table
createTheaterTable();



