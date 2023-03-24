const ddFindShop = document.getElementById("ddFindShop");
const tableShop = document.getElementById("tableShop");
const editShopForm = document.getElementById("editShopForm");

function fillShopDropDown(shop) {
    const el = document.createElement("option");
    el.textContent = shop.name;
    el.value = shop.id;
    el.shop = shop;
    ddFindShop.appendChild(el);
}

function fillShopsToDropDown(shops) {
    shops.forEach(shop => {
        fillShopDropDown(shop);
    });
}
function createFormEventListener() {
    getLocalEntities("shops")
        .then(shops => {
            fillShopsToDropDown(shops);
            console.log("Shops are loaded");
        })
        .catch(error => {
            console.log("error: ", error);
        });
}
function getSelectedShop() {
    const selectedShopIndex = ddFindShop.selectedIndex;
    if (selectedShopIndex < 0) {
        throw new Error("No shop is selected");
    }
    return ddFindShop.options[selectedShopIndex].shop;
}

function createShopInputs(shop) {
    try {
        const nameInput = createNameInput(shop);
        const priceInput = createPriceInput(shop);
        const quantityInput = createQuantityInput(shop);
        return nameInput + priceInput + quantityInput;
    } catch (error) {
        console.log("error: ", error);
        return new Error("Could not create shop inputs");
    }
}

function createNameInput(shop) {
    const labelName = `<label For="name">Name: ${shop.name}</label>`;
    const inputName = `<input type="text" name="name" id="name" value="${shop.name}" required><br><br>`;
    return labelName + inputName;
}
function createPriceInput(shop) {
    const labelPrice = `<label For="price">Price: ${shop.price}</label>`;
    const inputPrice = `<input type="number" name="price" id="price" value="${shop.price}" required><br><br>`;
    return labelPrice + inputPrice;
}

function createQuantityInput(shop) {
    const labelQuantity = `<label For="quantity">Quantity: ${shop.quantity}</label>`;
    const inputQuantity = `<input type="number" name="quantity" id="quantity" value="${shop.quantity}" required><br><br>`;
    return labelQuantity + inputQuantity;

}

function createSubmitButton(shop) {
    console.log(shop);

    return `<button onclick="updateShop(${shop.id})" id="pbSubmit">Edit Shop</button>`;
}

function deleteSubmitButton(shop) {
    return `<button onclick="deleteShop(${shop.id})" id="pbSubmit">Delete Shop</button>`;
}

function updateShop(shopId) {
    getLocalEntity("shop", shopId).then(shop => {
        shop.name = document.getElementById("name").value;
        shop.price = document.getElementById("price").value;
        shop.quantity = document.getElementById("quantity").value;
        console.log(shop);
        return shop;
    }).then(shop => {
        updateLocalEntity("shop", shop, shop.id)

            .then((result) => {
                if (result) {
                    alert("Shop updated");
                    window.location.href = "http://localhost:63342/KinoZippyFrontend/html/shopManager-edit.html"
                } else {
                    alert("Shop is not updated");
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

function deleteShop(shopId) {
    getLocalEntity("shop", shopId).then(shop => {
        console.log(shop);
        return shop;
    }).then(shop => {
        deleteLocalEntity("shop", shop, shop.id)

            .then((result) => {
                if (result) {
                    alert("Shop deleted");
                    window.location.href = "http://localhost:63342/KinoZippyFrontend/html/shopManager-edit.html"
                } else {
                    alert("Shop is not deleted");
                }
            }).catch((error) => {
            alert("Could not reach server");
            console.log(error);
        });
    })
}

async function selectShop() {
    tableShop.innerHTML = ""
    try {
        const selectedShop = getSelectedShop()
        console.log(selectedShop)
        tableShop.innerHTML = await createShopInputs(selectedShop)
        tableShop.innerHTML += createSubmitButton(selectedShop)
        tableShop.innerHTML += deleteSubmitButton(selectedShop)

    } catch (error) {
        console.log("error: ", error);
    }
}

        document.addEventListener('DOMContentLoaded', createFormEventListener);
        ddFindShop.addEventListener("change", selectShop);

