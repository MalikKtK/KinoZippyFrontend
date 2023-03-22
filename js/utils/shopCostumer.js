const productSelect = document.querySelector('select[name="products"]');
const sizeSelect = document.querySelector('select[name="sizes"]');
const quantityInput = document.querySelector('input[name="quantity"]');
const addToCartButton = document.querySelector('.add-to-cart');

let totalPrice = 0;

productSelect.addEventListener('change', updatePrice);
sizeSelect.addEventListener('change', updatePrice);
quantityInput.addEventListener('change', updatePrice);

function updatePrice() {
    const selectedProduct = productSelect.value;
    const selectedSize = sizeSelect.value;
    const quantity = parseInt(quantityInput.value);

    const pricePerItem = parseInt(sizeSelect.options[sizeSelect.selectedIndex].getAttribute('data-price'));
    const pricePerSize = parseInt(productSelect.options[productSelect.selectedIndex].getAttribute(`data-price-${selectedSize}`));

    totalPrice = pricePerSize + pricePerItem * quantity;

    addToCartButton.textContent = `Add to Cart (${totalPrice.toFixed(2)}kr.)`;
}
