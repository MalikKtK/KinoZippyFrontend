async function getMovieSchedule() {
    let showTimes = await getShowTimes();

    const movies = showTimes.reduce((acc, showtime) => {
        const movieId = showtime.movie.id;
        const movieTitle = showtime.movie.title;

        if (!acc[movieId]) {
            acc[movieId] = {
                title: movieTitle,

                showtimes: []
            };
        }
        acc[movieId].showtimes.push(showtime);
        return acc;
    }, {});


    return movies;
}


async function getShowTimes() {
    // Send the GET request to the server
    return fetch('http://localhost:8080/showtimes')
        .then(response => response.json())  // Convert the response to JSON format
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


getMovieSchedule().then(data => {
    // get the unordered list element
    const movieList = document.getElementById("movie_list");
    movieList.classList.add('list-unstyled');

    // fetch the movie schedule from the backend
    const movieSchedule = data;

    // loop through each movie in the movie schedule
    for (const movieId in movieSchedule) {
        const movie = movieSchedule[movieId];

        // create a new list item element for the movie
        const movieItem = document.createElement("li");
        movieItem.classList.add('d-flex');

        // add the movie title to the list item
        const movieTitle = document.createTextNode(movie.title);
        movieItem.appendChild(movieTitle);


        // group showTimes by day of the week
        const showtimesByDay = {};
        for (const showtime of movie.showtimes) {
            const dayOfWeek = new Date(showtime.startTime).toLocaleDateString(undefined, {weekday: 'long'});
            if (!showtimesByDay[dayOfWeek]) {
                showtimesByDay[dayOfWeek] = [];
            }
            showtimesByDay[dayOfWeek].push(showtime);
        }

        // create 7 columns for each day of the week
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const columns = {};
        for (const dayName of dayNames) {
            const column = document.createElement('ul');
            column.classList.add('list-unstyled');
            columns[dayName] = column;
            const columnHeading = document.createElement('p');
            columnHeading.classList.add('text-center');
            columnHeading.textContent = dayName;
            column.appendChild(columnHeading);
        }

        // loop through each showtime for each day and add to the corresponding column
        for (const dayName of dayNames) {
            const column = columns[dayName];
            const showtimes = showtimesByDay[dayName] || [];
            for (const showtime of showtimes) {
                const timeSlotButton = createTimeSlot(showtime);
                column.appendChild(timeSlotButton);
            }
        }

        for (const dayName of dayNames) {
            const column = columns[dayName];
            const listItem = document.createElement('div');
            listItem.appendChild(column);
            movieItem.appendChild(listItem);
        }

        movieList.appendChild(movieItem);


    }

    console.log(JSON.stringify(data, null, 2));
});

function createTimeSlot(showtime) {
    const showtimeButton = document.createElement('div');

    // create 3 small elements
    const e1 = document.createElement('small');
    const e2 = document.createElement('small');
    const e3 = document.createElement('small');

    // add text to each element
    e1.innerText = showtime.theater.name;

    const startTime = new Date(showtime.startTime);
    e2.innerText = `${startTime.getHours()}:${startTime.getMinutes()}`;

    const totalSeats = showtime.theater.rows * showtime.theater.numberedSeats;
    e3.innerText = `${(totalSeats - showtime.tickets.length)} / ${totalSeats}`;

    // append each paragraph element to the div element
    showtimeButton.appendChild(e1);
    showtimeButton.appendChild(e2);
    showtimeButton.appendChild(e3);

    showtimeButton.classList.add('btn', 'btn-primary', 'btn-block', 'd-flex', 'flex-column');

    // add event listener to the button
    showtimeButton.addEventListener('click', () => {
        sessionStorage.setItem('showTimeId', showtime.id);
        window.location.href = "theater.html";
    });

    return showtimeButton;
}