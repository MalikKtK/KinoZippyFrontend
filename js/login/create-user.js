let formUser;

const ddRole = document.getElementById("ddRole")

function fillRoleDropDown(role) {
    const el = document.createElement("option")
    el.textContent = role
    el.value = role
    ddRole.appendChild(el)
}

function fillRolesToDropDown(roles) {
    roles.forEach(role => {
        fillRoleDropDown(role)
    })
}

function createFormEventListener() {
    getLocalEntities("user/roles").then(roles => {
        fillRolesToDropDown(roles)
    }).then(() => {
        console.log("Roles are loaded")
        formUser = document.getElementById("formUser")
        formUser.addEventListener("submit", handleUserFormSubmit)
    }).catch(error => {
        console.log("error: ", error)
    })
}

async function handleUserFormSubmit(event) {
    //Vi handler submit her, i stedet for default html behaviour
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action;
    console.log(form)
    console.log(url)
    console.log(form === formUser)
    const selectedUserRoleIndex = ddRole.selectedIndex
    if (selectedUserRoleIndex < 0) {
        alert("Vælg en UserRole")
    } else {
        const plainUserFormData = preparePlainFormData(form, addSelectedDropDowns)
        console.log("plainUserFormData: ", plainUserFormData)

        postLocalForm(url, plainUserFormData).then(data => {
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
}

function addSelectedDropDowns(employee) {
    console.log("Employee:", employee)
    const seletecdEmployeeRoleIndex = ddRole.selectedIndex
    employee.role = ddRole.options[seletecdEmployeeRoleIndex].value
}

document.addEventListener('DOMContentLoaded', createFormEventListener);