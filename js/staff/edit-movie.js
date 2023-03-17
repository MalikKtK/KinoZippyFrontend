const ddFindMovie = document.getElementById("ddFindMovie");
const tableMovie = document.getElementById("tableMovie");

function fillAgeLimitDropDown(ageLimit, ageLimitDropdown) {
    const el = document.createElement("option")
    el.textContent = ageLimit
    el.value = ageLimit
    ageLimitDropdown.appendChild(el)
}

function fillAgeLimitsToDropDown(ageLimits, ageLimitDropdown) {
    ageLimits.forEach(ageLimit => {
        fillAgeLimitDropDown(ageLimit, ageLimitDropdown)
    })
}

function fillCategoryDropDown(category, categoryDropdown) {
    const el = document.createElement("option")
    el.textContent = category
    el.value = category
    categoryDropdown.appendChild(el)
}

function fillCategoriesToDropDown(categories, categoryDropdown) {
    categories.forEach(category => {
        fillCategoryDropDown(category, categoryDropdown)
    })
}

function fillMovieDropDown(movie) {
    const el = document.createElement("option");
    el.textContent = movie.title;
    el.value = movie.id;
    el.movie = movie;
    ddFindMovie.appendChild(el);
}

function fillMoviesToDropDown(movies) {
    movies.forEach(movie => {
        fillMovieDropDown(movie);
    });
}

function createFormEventListener() {
    getLocalEntities("movies")
        .then(movies => {
            fillMoviesToDropDown(movies);
            console.log("Movies are loaded");
        })
        .catch(error => {
            console.log("error: ", error);
        });
}

function getSelectedMovie() {
    const selectedMovieIndex = ddFindMovie.selectedIndex;
    if (selectedMovieIndex < 0) {
        throw new Error("No movie is selected");
    }
    return ddFindMovie.options[selectedMovieIndex].movie;
}


function createMovieInputs(movie) {
    try {
        const titleInput = createTitleInput(movie);
        const ageLimitInput = createAgeLimitInput(movie);
        const categoryInput = createCategoryInput(movie);
        const lengthInput = createLengthInput(movie);
        const ratingInput = createRatingInput(movie);
        return titleInput + ageLimitInput + categoryInput + lengthInput + ratingInput;
    } catch (error) {
        console.log("error: ", error);
        return new Error("Could not create movie inputs");
    }
}

function createTitleInput(movie) {
    const labelTitle = `<label For="title">Title: ${movie.title}</label>`;
    const inputTitle = `<input type="text" name="title" id="title" value="${movie.title}" required><br><br>`;
    return labelTitle + inputTitle;
}

function createAgeLimitInput(movie) {
    const ageLimitDropdown = document.createElement("select");
    const labelAgeLimit = `<label For="ddAgeLimit">AgeLimit: ${movie.ageLimit}</label>`;
    ageLimitDropdown.id = "ddAgeLimit";
    return labelAgeLimit + ageLimitDropdown.outerHTML + "<br><br>";
}

function createCategoryInput(movie) {
    const labelCategory = `<label For="ddCategory">Category: ${movie.category}</label>`;
    const categoryDropdown = document.createElement("select");
    categoryDropdown.id = "ddCategory";
    return labelCategory + categoryDropdown.outerHTML + "<br><br>";
}


function createLengthInput(movie) {
    const labelLength = `<label For="length">Length: ${movie.length}</label>`;
    const inputLength = `<input type="number" name="length" id="length" placeholder="Length" required value="${movie.length}"><br><br>`;
    return labelLength + inputLength;
}

function createRatingInput(movie) {
    const labelRating = `<label For="rating">Rating: ${movie.rating}</label>`;
    const inputRating = `<input type="number" name="rating" id="rating" placeholder="Rating 1-10" required min="1" max="10" step="1" value="${movie.rating}"><br> <br>`;
    return labelRating + inputRating;
}

function createSubmitButton(movie) {
    console.log(movie);

    return `<button onclick="updateMovie(${movie.id})" id="pbSubmit">Edit Movie</button>`;
}

function deleteSubmitButton(movie) {
    return `<button onclick="deleteMovie(${movie.id})" id="pbSubmit">Delete Movie</button>`;
}


function updateMovie(movieId) {
    getLocalEntity("movie", movieId).then(movie => {
        movie.title = document.getElementById("title").value;
        movie.ageLimit = document.getElementById("ddAgeLimit").value;
        movie.category = document.getElementById("ddCategory").value;
        movie.length = document.getElementById("length").value;
        movie.rating = document.getElementById("rating").value;
        console.log(movie);
        return movie;
    }).then(movie => {
        updateLocalEntity("movie", movie, movie.id)

            .then((result) => {
                if (result) {
                    alert("Movie updated");
                } else {
                    alert("Movie is not updated");
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

function deleteMovie(movieId) {
    getLocalEntity("movie", movieId).then(movie => {
        console.log(movie);
        return movie;
    }).then(movie => {
        deleteLocalEntity("movie", movie, movie.id)

            .then((result) => {
                if (result) {
                    alert("Movie deleted");
                } else {
                    alert("Movie is not deleted");
                }
            }).catch((error) => {
            alert("Could not reach server");
            console.log(error);
        });
})
}

async function selectMovie() {
    tableMovie.innerHTML = ""
    try {
        const selectedMovie = getSelectedMovie()
        console.log(selectedMovie)
        tableMovie.innerHTML = await createMovieInputs(selectedMovie)
        tableMovie.innerHTML += createSubmitButton(selectedMovie)
        tableMovie.innerHTML += deleteSubmitButton(selectedMovie)
        getLocalEntities("movie/agelimits")
            .then(ageLimits => {
                const fillAgeLimit = document.getElementById("ddAgeLimit");
                fillAgeLimitsToDropDown(ageLimits, fillAgeLimit);
                fillAgeLimit.value = selectedMovie.ageLimit;
                return getLocalEntities("movie/categories")
            }).then(categories => {
                const fillCategory = document.getElementById("ddCategory");
                fillCategoriesToDropDown(categories, fillCategory);
                fillCategory.value = selectedMovie.category;
        })

    } catch (Error) {
        console.log("Det virkede ikke", Error)
    }

}

document.addEventListener('DOMContentLoaded', createFormEventListener);
ddFindMovie.addEventListener("change", selectMovie);
