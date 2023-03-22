main();

async function main() {
    const movieSchedule = await getMovieSchedule();

    // get the unordered list element
    const movieList = document.getElementById("movie_list");
    movieList.classList.add('list-unstyled');

    // loop through each movie in the movie schedule
    for (const movieId in movieSchedule) {
        // const movie = movieSchedule[movieId];
        const {
            movie_title,
            movie_age_limit,
            movie_category,
            movie_length_in_minutes,
            showTimes
        } = movieSchedule[movieId];
        console.log(movieSchedule[movieId]);

        // template literal string
        const movieTemplate = `
            <div class="d-flex flex-column" >
                <div class="movie_info d-flex justify-content-between">
                    <p><b>${movie_title}</b></p>
                    <p>${movie_age_limit}</p>
                    <p>${movie_category}</p>
                    <p>${movie_length_in_minutes} min</p>
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
            const showtimeDate = new Date(showtime.showtime_start_time);
            const differenceTime = showtimeDate.getTime() - startDate.getTime();
            const differenceDays = Math.ceil(differenceTime / (1000 * 3600 * 24));
            const dayOfWeek = schedule[differenceDays];
            if (!showTimesByDay[dayOfWeek]) {
                showTimesByDay[dayOfWeek] = [];
            }
            showTimesByDay[dayOfWeek].push(showtime);
        }

        console.log(showTimesByDay);

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
                const timeSlotButton = createTimeSlotButton(showtime, movieSchedule[movieId].theater);
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
    // Send the GET request to the server
    return fetch('http://localhost:8080/movie_schedule')
        .then(response => response.json())  // Convert the response to JSON format
        .then(data => {

            const moviesScheduleById = {};

            for (const item of data) {
                const movieId = item.movie_id;

                // Create a new movie object
                if (!moviesScheduleById[movieId]) {
                    moviesScheduleById[movieId] = {
                        movie_title: item.movie_title,
                        movie_category: item.movie_category,
                        movie_length_in_minutes: item.movie_length_in_minutes,
                        movie_age_limit: item.movie_age_limit,
                        movie_rating: item.movie_rating,
                        theater: {
                            theater_id: item.theater_id,
                            theater_name: item.theater_name,
                            theater_seats: item.theater_seats,
                        },
                        showTimes: []
                    };
                }

                // Add the showtime object to the showtimes array for the theater
                moviesScheduleById[movieId].showTimes.push({
                    showtime_id: item.showtime_id,
                    showtime_price: item.showtime_price,
                    showtime_start_time: item.showtime_start_time,
                    showtime_end_time: item.showtime_end_time,
                    showtime_tickets: item.showtime_tickets,
                });
            }

            return moviesScheduleById;
        })
        .catch(error => {
            console.error('Error:', error);
        });
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

function createTimeSlotButton(showtime, theater) {
    const startTime = new Date(showtime.showtime_start_time);
    // const totalSeats = showtime.theater.rows * showtime.theater.numberedSeats;
    const availableSeats = theater.theater_seats - showtime.showtime_tickets;

    // template literal string
    const showtimeTemplate = `
        <div class="btn btn-primary btn-block d-flex flex-column">
            <div>${theater.theater_seats}</div>
            <div>${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}</div>
            <div>${availableSeats} / ${theater.theater_seats}</div>
        </div>
    `;

    // create a new element and set its innerHTML to the showtimeButton string
    const buttonElement = document.createElement('div');
    buttonElement.innerHTML = showtimeTemplate;

    // add event listener to the new element
    buttonElement.addEventListener('click', () => {
        sessionStorage.setItem('showTimeId', showtime.id);
        window.location.href = "theaterCustomerPurchase.html";
    });

    return buttonElement;
}

