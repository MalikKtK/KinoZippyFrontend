let formMovie;

const ddAgeLimit = document.getElementById("ddAgeLimit")
const ddCategory = document.getElementById("ddCategory")

function fillAgeLimitDropDown(ageLimit) {
    const el = document.createElement("option")
    el.textContent = ageLimit
    el.value = ageLimit
    ddAgeLimit.appendChild(el)
}

function fillAgeLimitsToDropDown(ageLimits) {
    ageLimits.forEach(ageLimit => {
        fillAgeLimitDropDown(ageLimit)
    })
}

function fillCategoryDropDown(category) {
    const el = document.createElement("option")
    el.textContent = category
    el.value = category
    ddCategory.appendChild(el)
}

function fillCategoriesToDropDown(categories) {
    categories.forEach(category => {
        fillCategoryDropDown(category)
    })
}

function createFormEventListener() {
    getLocalEntities("movie/agelimits").then(ageLimits => {
        fillAgeLimitsToDropDown(ageLimits)
    }).then(() => {
        return getLocalEntities("movie/categories")
    }).then(categories => {
        fillCategoriesToDropDown(categories)
    }).then(() => {
        console.log("Age limits and categories are loaded")
        formMovie = document.getElementById("formMovie")
        formMovie.addEventListener("submit", handleMovieFormSubmit)
    }).catch(error => {
        console.log("error: ", error)
    })
}

async function handleMovieFormSubmit(event) {
    //Vi handler submit her, i stedet for default html behaviour
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action;
    console.log(form)
    console.log(url)
    console.log(form === formMovie)
    const selectedAgeLimitIndex = ddAgeLimit.selectedIndex
    const selectedCategoryIndex = ddCategory.selectedIndex
    if (selectedAgeLimitIndex < 0) {
        alert("Vælg en aldersgrænse")
    } else if (selectedCategoryIndex < 0) {
        alert("Vælg en kategori")
    } else {
        const plainMovieFormData = preparePlainFormData(form, addSelectedDropDowns)
        console.log("plainMovieFormData: ", plainMovieFormData)
        postLocalForm(url, plainMovieFormData).then(data => {
            if (data) {
                console.log("data: ", data)
                alert("Film oprettet")
            } else {
                console.log("data: ", data)
                alert("Der skete en fejl")
            }
        }).catch(error => {
            console.log("error: ", error)
        })
    }
}

function addSelectedDropDowns(movie) {
    console.log("Movie:", movie)
    const selectedAgeLimitIndex = ddAgeLimit.selectedIndex
    movie.ageLimit = ddAgeLimit.options[selectedAgeLimitIndex].value
    const selectedCategoryIndex = ddCategory.selectedIndex
    movie.category = ddCategory.options[selectedCategoryIndex].value
}

document.addEventListener('DOMContentLoaded', createFormEventListener);