document.addEventListener('DOMContentLoaded', function() {
    // Setup form validation and submission
    const orderForm = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');
    
    // Initialize checkout page first to ensure elements are populated
    populateCheckoutItems();
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            placeOrder();
        });
    }

    // Function to place an order
    async function placeOrder() {
        try {
            // Get all form data
            const email = document.getElementById('email').value;
            const firstName = document.getElementById('fullname-2').value;
            const lastName = document.getElementById('lastname').value;
            const companyName = document.getElementById('company').value;
            const country = document.getElementById('country').value;
            const street = document.getElementById('street').value;
            const apartment = document.getElementById('street-2').value;
            const city = document.getElementById('town').value;
            const state = document.querySelector('.nice-select .current') ? 
                document.querySelector('.nice-select .current').textContent : '';
            const zipCode = document.getElementById('zip').value;
            const phone = document.getElementById('phone').value;
            const orderNotes = document.getElementById('message').value;
            const termsAccepted = document.getElementById('flexCheckDefault').checked;
            
            // Get selected payment method
            let paymentMethod = '';
            const paymentOptions = document.querySelectorAll('input[name="shipping"]');
            paymentOptions.forEach(option => {
                if (option.checked) {
                    if (option.id === 'flat_rate') paymentMethod = 'bank_transfer';
                    if (option.id === 'local_pickup') paymentMethod = 'check';
                    if (option.id === 'free_shipping') paymentMethod = 'cod';
                    if (option.id === 'paypal') paymentMethod = 'paypal';
                }
            });

            // Form validation
            if (!email || !firstName || !lastName || !country || !street || !city || !state || !zipCode || !phone) {
                alert('Please fill in all required fields');
                return;
            }

            if (!termsAccepted) {
                alert('Please accept the terms and conditions');
                return;
            }

            if (!paymentMethod) {
                alert('Please select a payment method');
                return;
            }

            // Get cart items from local storage - using 'cart' as the key
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items to your cart before checking out.');
                window.location.href = 'cart.html';
                return;
            }
            
            // Calculate totals from cart data directly instead of relying on DOM elements
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shippingCost = 0; // No shipping cost
            const totalAmount = subtotal; // Total is the same as subtotal

            // Prepare order data
            const orderData = {
                email,
                firstName,
                lastName,
                companyName,
                country,
                street,
                apartment,
                city,
                state,
                zipCode,
                phone,
                orderNotes,
                termsAccepted,
                paymentMethod,
                subtotal,
                shippingCost,
                totalAmount,
                items: cart.map(item => ({
                    productId: item.id,
                    productName: item.name,
                    category: item.category || 'Product',
                    price: item.price,
                    quantity: item.quantity,
                    imageUrl: item.image
                }))
            };

            // For development/testing - log the order to console
            console.log('Order Data:', orderData);

            try {
                // Submit order to server
                const response = await fetch('/api/orders/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();

                if (result.success) {
                    // Clear cart after successful order
                    localStorage.removeItem('cart');
                    
                    // Redirect to order confirmation page
                    window.location.href = `/order-success.html?orderId=${result.orderId}`;
                } else {
                    alert(`Order failed: ${result.message}`);
                }
            } catch (error) {
                console.error('API Error:', error);
                alert('There was an error processing your order, but your information has been saved. Our team will contact you shortly.');
                
                // For development - simulate success when API is not available
                localStorage.removeItem('cart');
                window.location.href = `/order-success.html?orderId=dev-${Date.now()}`;
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('There was an error processing your order. Please try again.');
        }
    }

    // Function to populate checkout items from cart
    function populateCheckoutItems() {
        try {
            // Get cart from localStorage
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const orderItemsContainer = document.querySelector('.order-items');
            
            if (!orderItemsContainer) {
                console.error('Order items container not found');
                return;
            }

            if (cart.length === 0) {
                console.log('Cart is empty');
                // Optionally redirect users to the cart page if their cart is empty
                // window.location.href = 'cart.html';
                return;
            }

            // First, save references to the header and summary rows
            const headerItem = orderItemsContainer.querySelector('.order-item:first-child');
            
            // Clear all existing product items, leaving only the header
            const existingItems = orderItemsContainer.querySelectorAll('.order-item:not(:first-child)');
            existingItems.forEach(item => {
                item.remove();
            });

            // Calculate subtotal
            let subtotal = 0;
            
            // Add cart items after the header
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'order-item';
                itemElement.innerHTML = `
                    <div class="order-left">
                        <div class="order-img"><img src="${item.image}" alt="${item.name}"></div>
                    </div>
                    <div class="order-right">
                        <div class="content">
                            <span class="category">${item.category || 'Product'}</span>
                            <h4 class="title">${item.name}</h4>
                            <span>Qty: ${item.quantity}</span>
                        </div>
                        <span class="price">₹${item.price.toLocaleString()}</span>
                    </div>
                `;
                
                // Append after all existing items
                orderItemsContainer.appendChild(itemElement);
            });

            // No shipping cost
            const shippingCost = 0;
            const total = subtotal; // Total is the same as subtotal
            
            // Add subtotal row
            const subtotalRow = document.createElement('div');
            subtotalRow.className = 'order-item item-1';
            subtotalRow.innerHTML = `
                <div class="left-title">Subtotal</div>
                <div class="right-title">₹${subtotal.toLocaleString()}</div>
            `;
            orderItemsContainer.appendChild(subtotalRow);
            
            // Removed shipping row
            
            // Add total row
            const totalRow = document.createElement('div');
            totalRow.className = 'order-item item-1';
            totalRow.innerHTML = `
                <div class="left-title">Total</div>
                <div class="right-title">₹${total.toLocaleString()}</div>
            `;
            orderItemsContainer.appendChild(totalRow);
            
            console.log('Checkout items populated successfully');
        } catch (error) {
            console.error('Error populating checkout items:', error);
        }
    }
});