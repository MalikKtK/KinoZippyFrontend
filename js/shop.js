let formShop;

function createFormEventListener() {
    formShop = document.getElementById("formShop")
    formShop.addEventListener("submit", handleShopFormSubmit)

}

async function handleShopFormSubmit(event) {
    //Vi handler submit her, i stedet for default html behaviour
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action;
    console.log(form)
    console.log(url)
    console.log(form === formShop)
        const plainShopFormData = preparePlainFormData(form, print)
        console.log("plainShopFormData: ", plainShopFormData)

        postLocalForm(url, plainShopFormData).then(data => {
            if (data) {
                console.log("data: ", data)
                alert("Item oprettet")
                window.location.href = "http://localhost:63342/KinoZippyFrontend/html/shopManager.html"
            } else {
                console.log("data: ", data)
                alert("Der skete en fejl")
            }
        }).catch(error => {
            console.log("error: ", error)
        })
}
function print(shop) {
    console.log("Shop:", shop)
}


document.addEventListener('DOMContentLoaded', createFormEventListener);