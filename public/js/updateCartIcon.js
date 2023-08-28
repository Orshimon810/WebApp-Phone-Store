$(document).ready(function() {
    const isLoggedIn = localStorage.getItem('token');
    const userPopup = $('.user-popup');

    // ...

    // Function to update the number of cart products
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const numCartProducts = cart ? cart.length : 0;
        $('.num-cart-products').text(numCartProducts);
    }

    // Update cart count on page load
    updateCartCount();
});