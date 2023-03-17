main();

async function main() {
    const movieSchedule = await getMovieSchedule();

    // get the unordered list element
    const movieList = document.getElementById("movie_list");
    movieList.classList.add('list-unstyled');

    // loop through each movie in the movie schedule
    for (const movieId in movieSchedule) {
        // const movie = movieSchedule[movieId];
        const { title, ageLimit, category, length, showTimes} = movieSchedule[movieId];

        // template literal string
        const movieTemplate = `
            <div class="d-flex flex-column" >
                <div class="movie_info d-flex justify-content-between">
                    <p><b>${title}</b></p>
                    <p>${ageLimit}</p>
                    <p>${category}</p>
                    <p>${length} min</p>
                </div>
                <div class="movie_schedule d-flex justify-content-between"></div>
            </div>
        `;

        // create a container for all movie info
        const movieElement = document.createElement('div');
        movieElement.innerHTML = movieTemplate;

        // create schedule for the next few days
        const scheduleElement = movieElement.querySelector('.movie_schedule');
        const scheduleLength = 7;
        const startDate = new Date();
        const schedule = createSchedule(startDate, scheduleLength);

        // group showTimes by day
        const showTimesByDay = {};
        for (const showtime of showTimes) {
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
            scheduleElement.appendChild(listItem);
        }

        movieList.appendChild(movieElement);
    }
}

async function getMovieSchedule() {
    let showTimes = await getShowTimes();

    return showTimes.reduce((movieSchedule, showtime) => {
        const movieId = showtime.movie.id;

        if (!movieSchedule[movieId]) {
            movieSchedule[movieId] = {
                id: movieId,
                title: showtime.movie.title,
                ageLimit: showtime.movie.ageLimit,
                category: showtime.movie.category,
                length: showtime.movie.length,

                showTimes: []
            };
        }
        movieSchedule[movieId].showTimes.push(showtime);
        return movieSchedule;
    }, {});
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
            <div>${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}</div>
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

