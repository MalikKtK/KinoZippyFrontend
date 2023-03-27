const ddFindShowTime = document.getElementById("ddFindShowTime");
const tableShowTime = document.getElementById("tableShowTime");


function fillTheaterDropDown(theater, theaterDropdown) {
    const el = document.createElement("option")
    el.textContent = theater.name
    el.value = theater.id
    theaterDropdown.appendChild(el)
}

function fillTheatersToDropDown(theaters, theaterDropdown) {
    theaters.forEach(theater => {
        fillTheaterDropDown(theater, theaterDropdown)
    })
}

function fillMovieDropDown(movie, movieDropdown) {
    const el = document.createElement("option")
    el.textContent = movie.title
    el.value = movie.id
    movieDropdown.appendChild(el)

}

function fillMoviesToDropDown(movies, movieDropdown) {
    movies.forEach(movie => {
        fillMovieDropDown(movie, movieDropdown)
    })
}

function fillShowTimeDropDown(showTime) {
    const el = document.createElement("option");
    el.textContent = `${showTime.movie.title} - theater: ${showTime.theater.name} time: ${showTime.startTime}`;
    el.value = showTime.id;
    el.showtime = showTime;
    ddFindShowTime.appendChild(el);
}

function fillShowTimesDropDown(showTimes) {
    showTimes.forEach(showTime => {
        fillShowTimeDropDown(showTime);
    });
}

function createFormEventListener() {
    getLocalEntities("showtimes")
        .then(showTimes => {
            fillShowTimesDropDown(showTimes);
            console.log("ShowTimes are loaded");
        })
        .catch(error => {
            console.log("error: ", error);
        });
}


function getSelectedShowTime() {
    const selectedShowTimeIndex = ddFindShowTime.selectedIndex;
    if (selectedShowTimeIndex < 0) {
        throw new Error("No ShowTIme is selected");
    }

    return ddFindShowTime.options[selectedShowTimeIndex].showtime;
}


function createShowTimeInputs(showTime) {
    try {
        const theaterInput = createTheaterInput(showTime);
        const movieInput = createMovieInput(showTime);
        const priceInput = createPriceInput(showTime);
        const startTimeInput = createStartTimeInput(showTime);
        const endTimeInput = createEndTimeInput(showTime);
        return theaterInput + movieInput + priceInput + startTimeInput + endTimeInput;
    } catch (error) {
        console.log("error: ", error);

        return new Error("Could not create movie inputs");
    }

}

function createTheaterInput(showTime) {
    const theaterDropdown = document.createElement("select");
    const labelTheater = `<label For="ddTheater">Theater: ${showTime.theater.name}</label>`;
    theaterDropdown.id = "ddTheater";
    return labelTheater + theaterDropdown.outerHTML + "<br><br>";
}

function createMovieInput(showTime) {
    const movieDropdown = document.createElement("select");
    const labelMovie = `<label For="ddMovie">Movie: ${showTime.movie.title}</label>`;
    movieDropdown.id = "ddMovie";
    return labelMovie + movieDropdown.outerHTML + "<br><br>";
}

function createPriceInput(showTime) {
    const labelPrice = `<label For="price">Price: ${showTime.price}</label>`;
    const inputPrice = `<input type="number" name="price" id="price" placeholder="Price" required value="${showTime.price}"><br><br>`;
    return labelPrice + inputPrice;
}

function createStartTimeInput(showTime) {
    const labelStartTime = `<label For="ddStartTime">StartTime: ${showTime.startTime}</label>`;
    const inputStartTime = `<input type="datetime-local" id="startTime" name="startTime" required value="${showTime.startTime}"><br><br>`;
    return labelStartTime + inputStartTime + "<br><br>";
}


function createEndTimeInput(showTime) {
    const labelEndTime = `<label For="endTime">EndTIme: ${showTime.endTime}</label>`;
    const inputRating = `<input type="datetime-local" id="endTime" name="endTime" required value="${showTime.endTime}"><br> <br>`;
    return labelEndTime + inputRating;
}

function createSubmitButton(showTime) {
    console.log(showTime);

    return `<button onclick="updateShowTIme(${showTime.id})" id="pbSubmit">Edit ShowTime</button> <br><br>`;
}

function deleteSubmitButton(showTime) {
    return `<button onclick="deleteShowTime(${showTime.id})" id="pbSubmit">Delete ShowTime</button>`;
}


async function updateShowTIme(showTimeId) {
    // create showtime
    const showtime = {
        theater: {
            id: document.getElementById("ddTheater").value,
        },
        movie: {
            id: document.getElementById("ddMovie").value,
        },
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        price: document.getElementById('price').value,
    };

    // put to server
    const url = "http://localhost:8080/showtime/";
    try {
        const response = await fetch(url + showTimeId, {
            method: "PUT",
            body: JSON.stringify(showtime),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to put showtime");
        } else {
            alert("Showtime updated");
            window.location.reload();
        }
    } catch (error) {
        console.log("error: ", error);
    }

}


async function deleteShowTime(showTimeId) {
    console.log(document.getElementById("ddTheater").value)
    console.log(document.getElementById("ddMovie").value)
    console.log(document.getElementById("ddTheater").value)
    console.log(document.getElementById('startTime').value)

    // create showtime
    const showtime = {
        theater: {
            id: document.getElementById("ddTheater").value,
        },
        movie: {
            id: document.getElementById("ddMovie").value,
        },
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        price: document.getElementById('price').value,
    };

    // delete server
    const url = "http://localhost:8080/showtime/";
    try {
        const response = await fetch(url + showTimeId, {
            method: "DELETE",
            body: JSON.stringify(showtime),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete showtime");
        } else {
            alert("Showtime Deleted");
            window.location.reload();
        }
    } catch (error) {
        console.log("error: ", error);
        alert("This showtime is already booked so you can't delete it");
    }
}

async function selectShowTime() {
    tableShowTime.innerHTML = "";
    try {
        const selectedShowTime = getSelectedShowTime()
        console.log(selectedShowTime);
        tableShowTime.innerHTML = await createShowTimeInputs(selectedShowTime)
        tableShowTime.innerHTML += createSubmitButton(selectedShowTime)
        tableShowTime.innerHTML += deleteSubmitButton(selectedShowTime)
        getLocalEntities("theaters")
            .then(theaters => {
                const fillTheaters = document.getElementById("ddTheater");
                fillTheatersToDropDown(theaters, fillTheaters);
                fillTheaters.value = selectedShowTime.theater.id;
                return getLocalEntities("movies")
            }).then(movies => {
            const fillMovies = document.getElementById("ddMovie");
            fillMoviesToDropDown(movies, fillMovies);
            fillMovies.value = selectedShowTime.movie.id;
        })
    } catch (Error) {
        console.log("Det virkede ikke", Error)
    }

}

document.addEventListener('DOMContentLoaded', createFormEventListener);
ddFindShowTime.addEventListener("change", selectShowTime);