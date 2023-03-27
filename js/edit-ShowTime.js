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
    return ddFindShowTime.options[selectedShowTimeIndex].showTime;
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
    const labelTheater = `<label For="ddTheater">Theater: ${showTime.theater}</label>`;
    theaterDropdown.id = "ddTheater";
    return labelTheater + theaterDropdown.outerHTML + "<br><br>";
}

function createMovieInput(showTime) {
    const movieDropdown = document.createElement("select");
    const labelMovie = `<label For="ddMovie">Movie: ${showTime.movie}</label>`;
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

    return `<button onclick="updateShowTIme(${showTime.id})" id="pbSubmit">Edit ShowTime</button>`;
}

function deleteSubmitButton(showTime) {
    return `<button onclick="deleteShowTime(${showTime.id})" id="pbSubmit">Delete ShowTime</button>`;
}


function updateShowTIme(showTimeId) {
    getLocalEntity("showTime", showTimeId).then(showTime => {
        showTime.title = document.getElementById("title").value;
        showTime.ageLimit = document.getElementById("ddAgeLimit").value;
        showTime.category = document.getElementById("ddCategory").value;
        showTime.length = document.getElementById("length").value;
        showTime.rating = document.getElementById("rating").value;
        console.log(showTime);
        return showTime;
    }).then(showTime => {
        updateLocalEntity("showTime", showTime, showTime.id)

            .then((result) => {
                if (result) {
                    alert("showTime updated");
                    window.location.href = "http://localhost:63342/KinoZippyFrontend/html/edit-showtime.html"
                } else {
                    alert("ShowTime is not updated");
                }
            }).catch((error) => {
            alert("Could not reach server");
            console.log(error);
        });
    }).catch((error) => {
        alert("Could not reach server");
        console.log(error)
    });
}

function deleteShowTime(showTimeId) {
    getLocalEntity("showTime", showTimeId).then(showTime => {
        console.log(showTime);
        return showTime;
    }).then(showTime => {
        deleteLocalEntity("showTime", showTime, showTime.id)

            .then((result) => {
                if (result) {
                    alert("ShowTime deleted");
                    window.location.href = "http://localhost:63342/KinoZippyFrontend/html/edit-showtime.html"
                } else {
                    alert("ShowTime is not deleted");
                }
            }).catch((error) => {
            alert("Could not reach server");
            console.log(error);
        });
    })
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
                fillTheaters.value = selectedShowTime.theater;
                return getLocalEntities("movies")
            }).then(movies => {
            const fillMovies = document.getElementById("ddMovies");
            fillMoviesToDropDown(movies, fillMovies);
            fillMovies.value = selectedShowTime.movie;
        }).then((showTimes) => {
            const fillShowTimes = document.getElementById("ddShowTimes");
            fillShowTimesDropDown(showTimes, fillShowTimes);
            fillShowTimes.value = selectedShowTime.showTime;
        })
    } catch (Error) {
        console.log("Det virkede ikke", Error)
    }

}

document.addEventListener('DOMContentLoaded', createFormEventListener);
ddFindShowTime.addEventListener("change", selectShowTime);