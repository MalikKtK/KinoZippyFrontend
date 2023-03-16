let formCustomer;



function createFormEventListener() {

        console.log("Roles are loaded")
        formCustomer = document.getElementById("formCustomer")
        formCustomer.addEventListener("submit", handleCustomerFormSubmit)
}

async function handleCustomerFormSubmit(event) {
    //Vi handler submit her, i stedet for default html behaviour
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action;
    console.log(form)
    console.log(url)
    console.log(form === formCustomer)

        const plainCustomerFromData = preparePlainFormData(form, addSelectedDropDowns)
        console.log("plainUserFormData: ", plainCustomerFromData)

        postLocalForm(url, plainCustomerFromData).then(data => {
            if (data) {
                console.log("data: ", data)
                alert("User oprettet")
            } else {
                console.log("data: ", data)
                alert("Der skete en fejl")
            }
        }).catch(error => {
            console.log("error: ", error)
        })
}

function addSelectedDropDowns(employee) {
    console.log("Employee:", employee)
}

document.addEventListener('DOMContentLoaded', createFormEventListener);