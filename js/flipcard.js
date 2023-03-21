// Select all card elements
const cards = document.querySelectorAll('.card');

// Loop through each card element
cards.forEach(card => {
    // Add click event listener to the card element
    card.addEventListener('click', () => {
        // Toggle the "flipped" class on the card element
        card.classList.toggle('flipped');
    });
});
