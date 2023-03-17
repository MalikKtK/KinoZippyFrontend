getMovieSchedule().then(movieSchedule => {
    // get the unordered list element
    const movieList = document.getElementById("movie_list");
    movieList.classList.add('list-unstyled');

    // loop through each movie in the movie schedule
    for (const movieId in movieSchedule) {
        const movie = movieSchedule[movieId];

        // create a new list item element for the movie
        const movieItem = document.createElement("li");
        movieItem.classList.add('d-flex', 'justify-content-between');

        // add the movie title to the list item
        const movieTitle = document.createTextNode(movie.title);
        movieItem.appendChild(movieTitle);

        // // template literal string
        // const movieTemplate = `
        //     <div class="d-flex" id="movie_" + >
        //         <div class="top_content">movieTitle</div>
        //         <div class="schedule d-flex justify-content-between"></div>
        //     </div>
        //     `;
        //
        // // create a new element and set its innerHTML to the showtimeButton string
        // const movieCompleteDiv = document.createElement('div');
        // movieCompleteDiv.innerHTML = movieTemplate;
        //
        // movieItem = document.getElementById()

        // create schedule for the next few days
        const scheduleLength = 7;
        const startDate = new Date();
        const schedule = createSchedule(startDate, scheduleLength);

        // group showTimes by day
        const showTimesByDay = {};
        for (const showtime of movie.showtimes) {
            const showtimeDate = new Date(showtime.startTime);
            const differenceTime = showtimeDate.getTime() - startDate.getTime();
            const differenceDays = Math.ceil(differenceTime / (1000 * 3600 * 24));
            const dayOfWeek = schedule[differenceDays];
            if (!showTimesByDay[dayOfWeek]) {
                showTimesByDay[dayOfWeek] = [];
            }
            showTimesByDay[dayOfWeek].push(showtime);
        }

        // create columns for each day
        const columns = {};
        for (const day of schedule) {
            const column = document.createElement('ul');
            column.classList.add('list-unstyled');
            columns[day] = column;
            const columnHeading = document.createElement('p');
            columnHeading.classList.add('text-center');
            columnHeading.textContent = day;
            column.appendChild(columnHeading);
        }

        // loop through each day and add showTimes to the corresponding column
        for (const day of schedule) {
            const column = columns[day];
            const showTimes = showTimesByDay[day] || [];
            for (const showtime of showTimes) {
                const timeSlotButton = createTimeSlotButton(showtime);
                column.appendChild(timeSlotButton);
            }
        }

        // add columns to the movie item
        for (const day of schedule) {
            const column = columns[day];
            const listItem = document.createElement('div');
            listItem.appendChild(column);
            movieItem.appendChild(listItem);
        }

        movieList.appendChild(movieItem);
    }
});

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

function createSchedule(startDate, numberOfDays) {
    let schedule = [];

    for (let i = 0; i < numberOfDays; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        schedule.push(`${date.toLocaleDateString(undefined, {weekday: 'long'})} ${date.getDate()}/${date.getMonth() + 1}`);
    }

    return schedule;
}

function createTimeSlotButton(showtime) {
    const startTime = new Date(showtime.startTime);
    const totalSeats = showtime.theater.rows * showtime.theater.numberedSeats;
    const availableSeats = totalSeats - showtime.tickets.length;

    // template literal string
    const showtimeTemplate = `
        <div class="btn btn-primary btn-block d-flex flex-column">
            <div>${showtime.theater.name}</div>
            <div>${startTime.getHours()}:${startTime.getMinutes()}</div>
            <div>${availableSeats} / ${totalSeats}</div>
        </div>
    `;

    // create a new element and set its innerHTML to the showtimeButton string
    const buttonElement = document.createElement('div');
    buttonElement.innerHTML = showtimeTemplate;

    // add event listener to the new element
    buttonElement.addEventListener('click', () => {
        sessionStorage.setItem('showTimeId', showtime.id);
        window.location.href = "theater.html";
    });

    return buttonElement;
}