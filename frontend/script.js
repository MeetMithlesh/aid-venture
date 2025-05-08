// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or start with empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Product database (based on provided data)
    const products = [
        {
            _id: 'product1',
            name: 'Individual Combat Medical Kit',
            image: 'assets/img/shop/shop-thumb-1.png', // Default image path
            description: 'Combat medical essentials for individual soldiers',
            brand: 'NSS',
            category: 'Combat Medical Kit',
            price: 8000,
            countInStock: 15,
            rating: 4.5,
            numReviews: 10
        },
        {
            _id: 'product2',
            name: 'Individual First Aid Kit(IFAK)',
            image: 'assets/img/shop/shop-thumb-2.png', // Default image path
            description: 'Personal first aid kit for emergency medical care',
            brand: 'NSS',
            category: 'Combat Medical Kit',
            price: 13500,
            countInStock: 15,
            rating: 4.5,
            numReviews: 10
        },
        {
            _id: 'product3',
            name: 'Squad/Section/BFNA Kit',
            image: 'assets/img/shop/shop-thumb-s1.png', // Default image path
            description: 'Comprehensive medical kit for squad-level care',
            brand: 'NSS',
            category: 'Combat Medical Kit',
            price: 45000,
            countInStock: 15,
            rating: 4.5,
            numReviews: 10
        },
        {
            _id: 'product4',
            name: 'Troop/Platoon/NA Kit',
            image: 'assets/img/shop/shop-thumb-3.png', // Default image path
            description: 'Advanced medical kit for platoon-level treatment',
            brand: 'NSS',
            category: 'Combat Medical Kit',
            price: 45000,
            countInStock: 15,
            rating: 4.5,
            numReviews: 10
        }
    ];
    
    // Get cart table body
    const cartTableBody = document.querySelector('.cart-table tbody');
    
    // Initial render of cart items
    renderCart();
    
    // Add event listeners for quantity changes
    attachEventListeners();

    /**
     * Find product by ID
     * @param {string} productId - Product ID to look for
     * @returns {Object|null} - Product object or null if not found
     */
    function findProduct(productId) {
        return products.find(product => product._id === productId) || null;
    }

    /**
     * Add item to cart
     * @param {string} productId - ID of product to add
     * @param {number} quantity - Quantity to add (default: 1)
     */
    window.addToCart = function(productId, quantity = 1) {
        const product = findProduct(productId);
        
        if (!product) {
            console.error(`Product with ID ${productId} not found`);
            return;
        }
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.productId === productId);
        
        if (existingItemIndex !== -1) {
            // Item exists, increase quantity
            cart[existingItemIndex].quantity += quantity;
            
            // Check against stock
            const stock = product.countInStock;
            if (cart[existingItemIndex].quantity > stock) {
                cart[existingItemIndex].quantity = stock;
                showNotification(`Only ${stock} items available in stock`);
            }
        } else {
            // Add new item with specified quantity
            cart.push({
                productId: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: Math.min(quantity, product.countInStock)
            });
        }
        
        // Save to localStorage
        saveCart();
        
        // Re-render cart
        renderCart();
        
        // Display notification
        showNotification(`${product.name} added to cart`);
    };
    
    /**
     * Add product to cart by name
     * @param {string} productName - Name of product to add
     * @param {number} quantity - Quantity to add (default: 1)
     */
    window.addToCartByName = function(productName, quantity = 1) {
        const product = products.find(p => p.name === productName);
        
        if (product) {
            addToCart(product._id, quantity);
        } else {
            console.error(`Product "${productName}" not found`);
        }
    };
    
    /**
     * Remove item from cart
     * @param {string} productId - ID of product to remove
     */
    function removeFromCart(productId) {
        cart = cart.filter(item => item.productId !== productId);
        saveCart();
        renderCart();
    }
    
    /**
     * Update item quantity
     * @param {string} productId - ID of product to update
     * @param {number} newQuantity - New quantity value
     */
    function updateQuantity(productId, newQuantity) {
        const itemIndex = cart.findIndex(item => item.productId === productId);
        
        if (itemIndex !== -1) {
            // Ensure quantity is at least 1
            newQuantity = Math.max(1, newQuantity);
            
            // Check against stock
            const product = findProduct(productId);
            if (product && newQuantity > product.countInStock) {
                newQuantity = product.countInStock;
                showNotification(`Only ${product.countInStock} items available in stock`);
            }
            
            cart[itemIndex].quantity = newQuantity;
            
            saveCart();
            renderCart();
        }
    }
    
    /**
     * Save cart to localStorage
     */
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    /**
     * Calculate cart total
     * @returns {number} - Total price of all items
     */
    function calculateTotal() {
        return cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    /**
     * Format price as Indian Rupees
     * @param {number} price - Price to format
     * @returns {string} - Formatted price string
     */
    function formatPrice(price) {
        return '₹' + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    
    /**
     * Render cart items to DOM
     */
    function renderCart() {
        // Clear existing cart items
        cartTableBody.innerHTML = '';
        
        if (cart.length === 0) {
            // Display empty cart message
            cartTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">Your cart is empty</td>
                </tr>
            `;
        } else {
            // Add each item to cart table
            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                
                const row = document.createElement('tr');
                row.setAttribute('data-product-id', item.productId);
                row.innerHTML = `
                    <td class="product-remove">
                        <button class="remove-item" data-id="${item.productId}"><i class="fa-sharp fa-regular fa-xmark"></i></button>
                    </td>
                    <td class="product-thumbnail">
                        <a href="shop-details.html?id=${item.productId}">
                            <img src="${item.image || 'assets/img/shop/shop-thumb-1.png'}" alt="${item.name}">
                        </a>
                        <div class="product-thumbnail">
                            <h4 class="title">${item.name}</h4>
                        </div>
                    </td>
                    <td class="product-price"><span class="amount">${formatPrice(item.price)}</span></td>
                    <td class="product-quantity">
                        <div class="quantity__group">
                            <button class="quantity-btn decrease" data-id="${item.productId}">-</button>
                            <input type="number" class="input-text qty text" name="quantity" value="${item.quantity}" 
                                min="1" max="100" step="1" autocomplete="off" data-id="${item.productId}">
                            <button class="quantity-btn increase" data-id="${item.productId}">+</button>
                        </div>
                    </td>
                    <td class="product-subtotal"><span class="amount">${formatPrice(subtotal)}</span></td>
                `;
                
                cartTableBody.appendChild(row);
            });
        }
        
        // Update cart totals
        updateCartTotals();
        
        // Reattach event listeners
        attachEventListeners();
    }
    
    /**
     * Update cart totals in the sidebar
     */
    function updateCartTotals() {
        const total = calculateTotal();
        
        // Update subtotal
        const subtotalElement = document.querySelector('.checkout-item:nth-child(2) .price');
        if (subtotalElement) {
            subtotalElement.textContent = formatPrice(total);
        }
        
        // Update total
        const totalElement = document.querySelector('.checkout-total span');
        if (totalElement) {
            totalElement.textContent = formatPrice(total);
        }
        
        // Update header cart total
        const headerCartTotal = document.querySelector('.header-cart-btn span');
        if (headerCartTotal) {
            headerCartTotal.textContent = formatPrice(total);
        }
        
        // Update cart count indicator if exists
        const cartCountIndicator = document.querySelector('.cart-count');
        if (cartCountIndicator) {
            const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountIndicator.textContent = itemCount;
        }
    }
    
    /**
     * Attach event listeners to cart controls
     */
    function attachEventListeners() {
        // Remove item buttons
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                
                // Get product name for notification
                const cartItem = cart.find(item => item.productId === productId);
                const productName = cartItem ? cartItem.name : 'Item';
                
                removeFromCart(productId);
                showNotification(`${productName} removed from cart`);
            });
        });
        
        // Quantity inputs
        const quantityInputs = document.querySelectorAll('.input-text.qty');
        quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
                const productId = this.getAttribute('data-id');
                const newQuantity = parseInt(this.value);
                updateQuantity(productId, newQuantity);
            });
        });
        
        // Increase quantity buttons
        const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
        increaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const input = document.querySelector(`.qty[data-id="${productId}"]`);
                const currentQuantity = parseInt(input.value);
                updateQuantity(productId, currentQuantity + 1);
            });
        });
        
        // Decrease quantity buttons
        const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
        decreaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const input = document.querySelector(`.qty[data-id="${productId}"]`);
                const currentQuantity = parseInt(input.value);
                if (currentQuantity > 1) {
                    updateQuantity(productId, currentQuantity - 1);
                }
            });
        });
        
        // Update cart button
        const updateCartBtn = document.querySelector('.update-btn');
        if (updateCartBtn) {
            updateCartBtn.addEventListener('click', function() {
                renderCart();
                showNotification('Cart updated');
            });
        }
        
        // Apply coupon button
        const applyCouponBtn = document.querySelector('.left-item .rr-primary-btn');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', function() {
                const couponInput = document.querySelector('.left-item .form-control');
                const couponCode = couponInput.value.trim();
                
                if (couponCode) {
                    // In a real app, you would validate the coupon with an API
                    // For demo, just show a success message
                    showNotification('Coupon applied');
                } else {
                    showNotification('Please enter a coupon code');
                }
            });
        }
        
        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function(e) {
                if (cart.length === 0) {
                    e.preventDefault();
                    showNotification('Your cart is empty. Add items before checkout.');
                }
                // Otherwise, let the button navigate to checkout page
            });
        }
    }
    
    /**
     * Show notification message
     * @param {string} message - Message to display
     */
    function showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('cart-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'cart-notification';
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = '#885B3A';
            notification.style.color = 'white';
            notification.style.padding = '12px 20px';
            notification.style.borderRadius = '4px';
            notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            notification.style.zIndex = '9999';
            notification.style.transition = 'opacity 0.3s ease-in-out';
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.style.opacity = '1';
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    }

    // For demo purposes - populate cart with sample items from our product database
    window.populateCartWithSamples = function() {
        if (cart.length === 0) {
            // Add two products for demonstration
            addToCart('product1', 1); // Individual Combat Medical Kit
            addToCart('product3', 1); // Squad/Section/BFNA Kit
        }
    };

    // Add CSS for quantity buttons
    const style = document.createElement('style');
    style.textContent = `
        .quantity__group {
            display: flex;
            align-items: center;
        }
        .quantity-btn {
            width: 30px;
            height: 30px;
            background-color: #f0f0f0;
            border: 1px solid #ddd;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .quantity-btn:hover {
            background-color: #e0e0e0;
        }
        .input-text.qty {
            width: 50px;
            text-align: center;
            margin: 0 5px;
        }
        #cart-notification {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);

    // Initialize cart with existing items from HTML if empty
    if (cart.length === 0) {
        // Look for existing products in the HTML
        const existingRows = document.querySelectorAll('.cart-table tbody tr');
        
        if (existingRows.length > 0) {
            existingRows.forEach((row, index) => {
                const nameElement = row.querySelector('.product-thumbnail .title');
                const priceElement = row.querySelector('.product-price .amount');
                const quantityInput = row.querySelector('.input-text.qty');
                const imageElement = row.querySelector('.product-thumbnail img');
                
                if (nameElement && priceElement && quantityInput && imageElement) {
                    const name = nameElement.textContent.trim();
                    // Parse price (remove currency symbol and convert to number)
                    const price = parseFloat(priceElement.textContent.replace('₹', '').replace(/,/g, ''));
                    const quantity = parseInt(quantityInput.value);
                    const image = imageElement.getAttribute('src');
                    
                    // Find product in our database
                    const matchedProduct = products.find(p => p.name === name);
                    const productId = matchedProduct ? matchedProduct._id : `product${index + 1}`;
                    
                    cart.push({
                        productId,
                        name,
                        price,
                        quantity,
                        image
                    });
                }
            });
            
            // Save initial cart to localStorage
            saveCart();
            
            // Render the cart with our enhanced UI
            renderCart();
        }
    }
    
    // Export functions to window for use on product pages
    window.cartFunctions = {
        addToCart,
        addToCartByName,
        removeFromCart,
        updateQuantity,
        renderCart,
        getCart: () => cart
    };
    
    // Optional: auto-populate cart with demo items for testing
    // Comment this out for production use
    // populateCartWithSamples();
});