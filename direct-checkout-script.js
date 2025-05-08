/**
 * direct-checkout.js - Simple script to enable direct checkout functionality
 * Add this script to all product pages to enable the "Buy Now" button
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Find the "Buy The Item Now" button on all product pages
    const buyNowButton = document.querySelector('.shop-details-btn');
    
    if (buyNowButton) {
        // Add click event listener to the button
        buyNowButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product information from the page
            const productInfo = {
                name: document.querySelector('.product-details .title').textContent.trim(),
                price: document.querySelector('.price').textContent.trim().split(' ')[2], // Extract price value
                quantity: document.querySelector('input[type="number"]').value || 1,
                image: document.querySelector('.gallary-item img').src
            };
            
            // Save product to localStorage for the checkout page to use
            localStorage.setItem('directCheckoutItem', JSON.stringify(productInfo));
            
            // Redirect to checkout page
            window.location.href = 'checkout.html?direct=true';
        });
    }
});
