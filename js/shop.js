var cart = [];
var products = [
    {id: 1, name: "Lille popcorn", price: 40},
    {id: 2, name: "Mellem popcorn", price: 50},
    {id: 3, name: "Stor popcorn", price: 60},
    {id: 4, name: "Lille sodavand", price: 30},
    {id: 5, name: "Mellem sodavand", price: 40},
    {id: 6, name: "Stor sodavand", price: 50}
];

function addToCart(productId) {
    var product = products.find(function(p) {
        return p.id === productId;
    });

    if (product) {
        cart.push(product);
        updateCart();
    }
}

function updateCart() {
    var cartItems = document.getElementById("cart-items");
    var cartTotal = document.getElementById("cart-total");
    var total = 0;
    //var total = 0;

    cartItems.innerHTML = "";
    cart.forEach(function(product) {
        var li = document.createElement("li");
        li.innerHTML = product.name + " - kr: " + product.price; //kr per item
        cartItems.appendChild(li);
        total += product.price;
    });

    cartTotal.innerHTML = "- kr: " + total.toFixed(2); //total kr
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    var total = cart.reduce(function(sum, product) {
        return sum + product.price;
    }, 0);

    alert("Your total is kr: " + total.toFixed(2) + ". Thank you for shopping!");
    cart = [];
    window.location.href = "index.html";
    //updateCart();
}
