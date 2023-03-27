let formShowTime;

const ddTheater = document.getElementById("ddTheater")
const ddMovie = document.getElementById("ddMovie")

function fillTheaterToDropDown(theater) {
    const el = document.createElement("option")
    el.textContent = theater.name
    el.value = theater.id
    ddTheater.appendChild(el)
}

function fillTheatersToDropDown(theaters) {
    theaters.forEach(theater => {
        fillTheaterToDropDown(theater)
    })
}

function fillMovieDropDown(movie) {
    const el = document.createElement("option")
    el.textContent = movie.title
    el.value = movie.id
    ddMovie.appendChild(el)
}

function fillMoviesToDropDown(movies) {
    movies.forEach(movie => {
        fillMovieDropDown(movie)
    })
}

function createFormEventListener() {
    getLocalEntities("theaters").then(theaters => {
        fillTheatersToDropDown(theaters)
    }).then(() => {
        return getLocalEntities("movies")
    }).then(movies => {
        fillMoviesToDropDown(movies)
    }).then(() => {
        console.log("Theaters and movies are loaded")
        formShowTime = document.getElementById("formShowTime")
        formShowTime.addEventListener("submit", handleShowTimeFormSubmit)
    }).catch(error => {
        console.log("error: ", error)
    })
}

async function handleShowTimeFormSubmit(event) {
    //Vi handler submit her, i stedet for default html behaviour
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action;
    console.log(form)
    console.log(url)
    console.log(form === formShowTime)
    const selectedTheaterIndex = ddTheater.selectedIndex
    const selectedMovieIndex = ddMovie.selectedIndex
    if (selectedTheaterIndex < 0) {
        alert("Vælg en Theater")
    } else if (selectedMovieIndex < 0) {
        alert("Vælg en film")
    } else {
        const showtime = {
            theater: {
                id: ddTheater[selectedTheaterIndex].value,
            },
            movie: {
                id: ddMovie[selectedMovieIndex].value,
            },
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            price: document.getElementById('price').value,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(showtime),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to create showtime");
            } else {
                alert("Showtime created");
                window.location.reload();
            }

        } catch (error) {
            console.error(error);
            alert("An error occurred while creating the showtime");
        }
    }
}

document.addEventListener('DOMContentLoaded', createFormEventListener);