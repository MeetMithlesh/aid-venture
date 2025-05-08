/**
 * buy-now.js - Global implementation for "Buy Now" functionality across all product pages
 * This file should be included in all product detail pages and the checkout page
 */

// Primary function to initialize Buy Now functionality
function initBuyNowFunctionality() {
    // Check if we're on a product page (has the buy now button)
    const buyNowBtn = document.querySelector('.shop-details-btn');
    
    if (buyNowBtn) {
        console.log("Buy Now button detected - setting up product page handler");
        setupProductPageBuyNow(buyNowBtn);
    }
    
    // Check if we're on the checkout page (has URL parameter or checkout elements)
    const isCheckoutPage = window.location.pathname.includes('checkout') || 
                          document.querySelector('.checkout-items') !== null || 
                          document.querySelector('.order-details-list') !== null;
                          
    if (isCheckoutPage) {
        console.log("Checkout page detected - setting up checkout handler");
        handleBuyNowCheckout();
    }
}

// Set up Buy Now button on product pages
function setupProductPageBuyNow(buyNowBtn) {
    buyNowBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get common product details that are present on all product pages
        // Using more robust selectors that should work across all product pages
        const productDetails = getProductDetails();
        
        if (productDetails) {
            // Store this single item in sessionStorage
            sessionStorage.setItem('buyNowItem', JSON.stringify(productDetails));
            
            // Redirect to checkout page
            window.location.href = 'checkout.html?buyNow=true';
        } else {
            console.error("Could not extract product details");
        }
    });
}

// Extract product details from the current page
function getProductDetails() {
    try {
        // Try multiple possible selectors to handle different page structures
        const productName = document.querySelector('.product-details .title')?.textContent || 
                           document.querySelector('.product-info .title')?.textContent || 
                           document.querySelector('h1.title')?.textContent;
        
        // Extract price: try to find the actual price (not the crossed-out one)
        const priceElement = document.querySelector('.price');
        let productPrice = '';
        
        if (priceElement) {
            // Handle different price formats
            const priceText = priceElement.textContent.trim();
            // Try to extract the actual price (not the crossed-out one)
            // This regex looks for price formats like "Rs. 8000.00" or "₹8000"
            const priceMatch = priceText.match(/(?:Rs\.|₹)\s*(\d+(?:\.\d+)?)/);
            productPrice = priceMatch ? priceMatch[1] : priceText.split(' ')[1];
        }
        
        // Get quantity
        const quantityInput = document.querySelector('input[type="number"]');
        const productQuantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        // Get image - try multiple possible selectors
        const productImage = document.querySelector('.gallary-item img')?.getAttribute('src') || 
                            document.querySelector('.product-gallary img')?.getAttribute('src') || 
                            document.querySelector('.product-slider-wrap img')?.getAttribute('src');
        
        // Extract any other details that might be needed for the checkout
        const productId = document.querySelector('[data-product-id]')?.getAttribute('data-product-id') || 
                         'product-' + new Date().getTime(); // Fallback to timestamp
        
        return {
            id: productId,
            name: productName,
            price: productPrice,
            quantity: productQuantity,
            image: productImage,
            buyNow: true
        };
    } catch (error) {
        console.error("Error extracting product details:", error);
        return null;
    }
}

// Handle the Buy Now flow on the checkout page
function handleBuyNowCheckout() {
    // Check if we're coming from a Buy Now action
    const urlParams = new URLSearchParams(window.location.search);
    const isBuyNow = urlParams.get('buyNow') === 'true';
    
    if (isBuyNow) {
        console.log("Buy Now mode detected");
        // Retrieve the buy now item
        const buyNowItemJson = sessionStorage.getItem('buyNowItem');
        
        if (buyNowItemJson) {
            const buyNowItem = JSON.parse(buyNowItemJson);
            
            // Display only this item in the checkout
            displayBuyNowItem(buyNowItem);
            
            // Calculate and show total
            updateCheckoutTotal(buyNowItem);
            
            // Add a note to the checkout that this is a "Buy Now" order
            addBuyNowIndicator();
            
            // Clear the buyNow item after displaying
            // This prevents it from showing up if the user navigates back later
            // Comment this out if you want the Buy Now item to persist until checkout completes
            // sessionStorage.removeItem('buyNowItem');
        } else {
            console.error("Buy Now parameter present but no item found in session storage");
            // Fallback to normal checkout
            loadCartItems();
        }
    } else {
        console.log("Regular checkout mode");
        // Normal checkout flow with cart items
        if (typeof loadCartItems === 'function') {
            loadCartItems();
        } else {
            console.warn("loadCartItems function not found - make sure your cart script is loaded");
        }
    }
}

// Display the buy now item in the checkout
function displayBuyNowItem(item) {
    // Try to find checkout items container with various possible selectors
    const checkoutItemsContainer = document.querySelector('.checkout-items') || 
                                  document.querySelector('.order-details-list') ||
                                  document.querySelector('.cart-items');
    
    if (checkoutItemsContainer) {
        // Clear any existing items that might be from the cart
        checkoutItemsContainer.innerHTML = '';
        
        // Create HTML for the buy now item - adapt this to match your checkout page structure
        const itemHTML = `
            <div class="checkout-item" data-buy-now="true">
                <div class="checkout-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="checkout-item-content">
                    <h5>${item.name}</h5>
                    <div class="checkout-item-info">
                        <span class="quantity">Qty: ${item.quantity}</span>
                        <span class="price">₹${item.price}</span>
                    </div>
                </div>
            </div>
        `;
        
        checkoutItemsContainer.innerHTML = itemHTML;
    } else {
        console.error("Could not find checkout items container");
    }
}

// Update checkout page total based on buy now item
function updateCheckoutTotal(item) {
    // Try multiple selectors to handle different checkout page structures
    const subtotalElement = document.querySelector('.checkout-subtotal .amount') || 
                           document.querySelector('.subtotal-amount') ||
                           document.querySelector('[data-subtotal]');
                           
    const totalElement = document.querySelector('.checkout-total .amount') || 
                        document.querySelector('.total-amount') ||
                        document.querySelector('[data-total]');
    
    if (subtotalElement && totalElement) {
        const price = parseFloat(item.price.replace(/,/g, ''));
        const subtotal = price * item.quantity;
        
        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        totalElement.textContent = `₹${subtotal.toFixed(2)}`;
    } else {
        console.warn("Could not find total elements to update");
    }
}

// Add a visual indicator that this is a Buy Now checkout
function addBuyNowIndicator() {
    const checkoutTitle = document.querySelector('.checkout-title') || 
                         document.querySelector('.page-header-content h1');
                         
    if (checkoutTitle) {
        // Add a small badge or label
        const badge = document.createElement('span');
        badge.className = 'buy-now-badge';
        badge.textContent = 'Buy Now';
        badge.style.cssText = 'background-color: #885B3A; color: white; padding: 3px 8px; font-size: 12px; border-radius: 4px; margin-left: 10px;';
        
        checkoutTitle.appendChild(badge);
    }
    
    // You could also add a hidden input to the form to indicate this is a Buy Now order
    const checkoutForm = document.querySelector('form.checkout-form') || 
                        document.querySelector('form');
                        
    if (checkoutForm) {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'buy_now_order';
        hiddenInput.value = 'true';
        
        checkoutForm.appendChild(hiddenInput);
    }
}

// Initialize the functionality when the DOM is ready
document.addEventListener('DOMContentLoaded', initBuyNowFunctionality);