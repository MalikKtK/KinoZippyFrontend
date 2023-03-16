var cart = [];
var products = [
    {id: 1, name: "Lille popcorn", price: 40, quantity: 10, counter: 0},
    {id: 2, name: "Mellem popcorn", price: 50, quantity: 10, counter: 0},
    {id: 3, name: "Stor popcorn", price: 60, quantity: 10, counter: 0},
    {id: 4, name: "Lille sodavand", price: 30, quantity: 10, counter: 0},
    {id: 5, name: "Mellem sodavand", price: 40, quantity: 10, counter: 0},
    {id: 6, name: "Stor sodavand", price: 50, quantity: 10, counter: 0},
];

function addToCart(productId) {
    var product = products.find(function(p) {
        return p.id === productId;
    });

    if (product && product.quantity > 0) {
        cart.push(product);
        product.quantity--;
        product.counter++;
        updateCart();
        saveCart();
    } else {
        alert("Sorry, this product is out of stock.");
    }
}

function updateCart() {
    var cartItems = document.getElementById("cart-items");
    var cartTotal = document.getElementById("cart-total");
    var total = 0;

    cartItems.innerHTML = "";
    cart.forEach(function(product) {
        var li = document.createElement("li");
        li.innerHTML = product.name + " - kr: " + product.price + " - Quantity: " + product.counter;
        cartItems.appendChild(li);
        total += product.price * product.counter;
    });

    cartTotal.innerHTML = "- kr: " + total.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    var total = cart.reduce(function(sum, product) {
        return sum + product.price * product.counter;
    }, 0);

    alert("Your total is kr: " + total.toFixed(2) + ". Thank you for shopping!");
    cart.forEach(function(product) {
        product.quantity += product.counter;
        product.counter = 0;
    });
    cart = [];
    updateCart();
    saveCart();
    window.location.href = "index.html";
}

function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    var savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

loadCart();
