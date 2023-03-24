const sizeSelect = document.querySelector('select[name="sizes"]');
const quantityInput = document.querySelector('input[name="quantity"]');
const addToCartButton = document.getElementById('add-to-cart');
const productSelect = document.getElementById('productsSelect');
const checkoutButton = document.getElementById('checkoutButton');

// product information from database
let products = [];

populateProducts();

async function populateProducts() {
    // get items from the server
    products = await fetch('http://localhost:8080/shops')
        .then(response => response.json())  // Convert the response to JSON format
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // populate dropdown
    console.log(products);
    products.forEach(p => {
        const el = document.createElement("option");
        el.textContent = `${p.name} : ${p.price} kr.`;
        el.value = p.id;

        // create a new object to hold product information and options
        const productOption = {
            id: p.id, name: p.name, price: p.price, quantity: p.quantity
        };

        // attach the productOption object to the option element
        el.productOption = productOption;

        productSelect.appendChild(el);
    });
}


let cart = {};

document.getElementById("shopForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // prevent form submission

    // requested quantity
    const requestedQuantity = parseInt(quantityInput.value);

    // get requested product
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const item = products.find(obj => obj.id === parseInt(selectedOption.value));

    // check stock quantity
    if (item.quantity < (requestedQuantity + (cart[item.id]?.quantity || 0))) { //  + cart[item.id].quantity
        alert(`Not enough items in stock only ${item.quantity} left`);
        return;
    }

    // add item to cart
    if (!cart[item.id]) {
        cart[item.id] = {
            id: item.id, name: item.name, price: item.price, quantity: requestedQuantity
        };
    } else {
        cart[item.id].quantity += requestedQuantity;
    }

    updateCart();
});

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    let total = 0;

    // remove previous items
    cartItems.innerHTML = "";

    // add new items
    for (const id in cart) {
        const quantityPrice = cart[id].price * cart[id].quantity;
        const li = document.createElement("li");
        li.innerHTML = `${cart[id].name} x ${cart[id].quantity}  : ${quantityPrice} kr.`; //kr per item
        cartItems.appendChild(li);
        total += quantityPrice;
    }

    cartTotal.innerHTML = `TOTAL: ${total.toFixed(2)} kr.`; //total kr
}


checkoutButton.addEventListener("click", checkout);

async function checkout() {
    // check if cart is empty
    if (cart.length === 0) {

        alert("Your cart is empty!");
        return;
    }

    alert("Thank you for your purchase!");

    // update product quantities
    let updatedProducts = [];
    for (const id in cart) {
        const oldProduct = products.find(obj => obj.id === parseInt(id));
        oldProduct.quantity -= cart[id].quantity;
        updatedProducts.push(oldProduct);
    }

    console.log(JSON.stringify(updatedProducts));

    // send cart to server
    const url = 'http://localhost:8080/shop';
    const options = {
        method: 'PUT', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(updatedProducts)
    };

    // Send the request
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    // refresh page
    window.location.reload();
}