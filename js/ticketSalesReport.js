fetch('http://localhost:8080/tickets/sales')
    .then(response => response.json())
    .then(data => {
        const reportBody = document.getElementById('report-body');
        data.forEach(row => {
            const tr = document.createElement('tr');
            const showtimeId = document.createElement('td');
            showtimeId.innerText = row.showtime_id;
            tr.appendChild(showtimeId);

            const movie_title = document.createElement('td');
            movie_title.innerText = row.movie_title;
            tr.appendChild(movie_title);
            reportBody.appendChild(tr);

            const theater_name = document.createElement('td');
            theater_name.innerText = row.theater_name;
            tr.appendChild(theater_name);
            reportBody.appendChild(tr);

            const ticketsSold = document.createElement('td');
            ticketsSold.innerText = row.tickets_sold;
            tr.appendChild(ticketsSold);

            const ticketsAppended = document.createElement('td');
            ticketsAppended.innerText = row.tickets_attended;
            tr.appendChild(ticketsAppended);
            reportBody.appendChild(tr);
        });
    })
    .catch(error => console.error(error));