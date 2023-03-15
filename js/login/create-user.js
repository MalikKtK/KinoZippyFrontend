let formUser;
const dduserRole = document.getElementById("dduserRole")

function createFormEventListener() {
    formUser = document.getElementById("formUser")
    formUser.addEventListener("submit", handleMovieFormSubmit)
}


async function handleMovieFormSubmit(event) {
    //Vi handler submit her, i stedet for default html behaviour
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action;
    console.log(form)
    console.log(url)
    console.log(form === formUser)
}


document.addEventListener('DOMContentLoaded', createFormEventListener);