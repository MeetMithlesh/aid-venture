document.addEventListener('DOMContentLoaded', function () {
    // Initialize cart from localStorage or start with an empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to render the cart
    function renderCart() {
        const cartTableBody = document.querySelector('.cart-table tbody');
        if (!cartTableBody) return;

        // Clear existing cart items
        cartTableBody.innerHTML = '';

        if (cart.length === 0) {
            cartTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">Your cart is empty</td>
                </tr>
            `;
        } else {
            cart.forEach((item, index) => {
                const subtotal = item.price * item.quantity;
                const row = `
                    <tr data-index="${index}">
                        <td class="product-remove">
                            <button class="remove-item" data-index="${index}"><i class="fa-sharp fa-regular fa-xmark"></i></button>
                        </td>
                        <td class="product-thumbnail">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="product-thumbnail">
                                <h4 class="title">${item.name}</h4>
                            </div>
                        </td>
                        <td class="product-price"><span class="amount">₹${item.price.toLocaleString()}</span></td>
                        <td class="product-quantity">
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                        </td>
                        <td class="product-subtotal"><span class="amount">₹${subtotal.toLocaleString()}</span></td>
                    </tr>
                `;
                cartTableBody.insertAdjacentHTML('beforeend', row);
            });
        }

        updateCartTotals();
        attachEventListeners();
    }

    // Function to update cart totals
    function updateCartTotals() {
        const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        const subtotalElement = document.querySelector('.checkout-item:nth-child(2) .price');
        const totalElement = document.querySelector('.checkout-total span');

        if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
        if (totalElement) totalElement.textContent = `₹${subtotal.toLocaleString()}`;
    }

    // Function to update cart display in the header
    function updateCartDisplay() {
        const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        const cartCountElement = document.querySelector('.header-cart-btn span');
        if (cartCountElement) {
            cartCountElement.textContent = `₹${cartTotal.toLocaleString()}`;
        }
    }

    // Function to add a product to the cart
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            cart.push({ ...product, quantity: product.quantity || 1 });
        }
        saveCart();
        renderCart();
        updateCartDisplay();
        alert(`${product.name} added to cart!`);
    }

    // Function to remove a product from the cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
        updateCartDisplay();
    }

    // Function to update product quantity
    function updateQuantity(index, quantity) {
        if (quantity < 1) return;
        cart[index].quantity = quantity;
        saveCart();
        renderCart();
        updateCartDisplay();
    }

    // Attach event listeners to cart actions
    function attachEventListeners() {
        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.dataset.index, 10);
                removeFromCart(index);
            });
        });

        // Quantity input fields
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function () {
                const index = parseInt(this.dataset.index, 10);
                const quantity = parseInt(this.value, 10);
                updateQuantity(index, quantity);
            });
        });
    }

    // Define product data by ID
    const products = {
        'icmk': {
            id: 'icmk',
            name: 'Individual Combat Medical Kit(ICMK)',
            price: 8000,
            category: 'Combat',
            image: 'assets/img/shop/shop-1.png'
        },
        'ifak': {
            id: 'ifak',
            name: 'Individual First Aid Kit(IFAK)',
            price: 12450,
            category: 'Combat',
            image: 'assets/img/shop/shop-1.png'
        },
        // Add more products as needed
    };

    // Add event listeners to "Add to Cart" buttons on shop listing pages
    document.querySelectorAll('.shop-list li a i.fa-regular.fa-cart-shopping').forEach(button => {
        button.closest('a').addEventListener('click', function (e) {
            e.preventDefault();
            const productElement = this.closest('.shop-item');
            const productId = productElement.dataset.id;
            
            if (products[productId]) {
                addToCart(products[productId]);
            } else {
                const product = {
                    id: productId,
                    name: productElement.querySelector('.title').textContent.trim(),
                    price: parseFloat(productElement.querySelector('.price').textContent.replace('₹', '').replace(/,/g, '')),
                    image: productElement.querySelector('img').src,
                    quantity: 1
                };
                addToCart(product);
            }
        });
    });

    // Add event listener to "Add to Cart" button on product details page
    const detailAddToCartBtn = document.querySelector('.cart-btn');
    if (detailAddToCartBtn) {
        detailAddToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product details from the page
            const productTitle = document.querySelector('.product-details .title').textContent.trim();
            const productPrice = parseFloat(document.querySelector('.product-details .price').textContent.replace('Rs. ', '').replace(/,/g, ''));
            const productImage = document.querySelector('.product-gallary .gallary-item img').src;
            
            // Get quantity from the input field
            const quantityInput = document.querySelector('input[type="number"]');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            
            // Extract product ID from URL or use default
            const pathParts = window.location.pathname.split('/');
            const pageName = pathParts[pathParts.length - 1].replace('.html', '');
            
            // Map page names to product IDs
            const pageToProductMap = {
                'elevate-details': 'icmk',
                // Add more mappings as needed
            };
            
            const productId = pageToProductMap[pageName] || 'icmk';
            
            const product = {
                id: productId,
                name: productTitle,
                price: productPrice,
                image: productImage,
                quantity: quantity
            };
            
            addToCart(product);
        });
    }

    // Add event listener to "Buy Now" button on product details page
    const buyNowBtn = document.querySelector('.shop-details-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product details from the page
            const productTitle = document.querySelector('.product-details .title').textContent.trim();
            const productPrice = parseFloat(document.querySelector('.product-details .price').textContent.replace('Rs. ', '').replace(/,/g, ''));
            const productImage = document.querySelector('.product-gallary .gallary-item img').src;
            
            // Get quantity from the input field
            const quantityInput = document.querySelector('input[type="number"]');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            
            // Extract product ID from URL or use default
            const pathParts = window.location.pathname.split('/');
            const pageName = pathParts[pathParts.length - 1].replace('.html', '');
            
            // Map page names to product IDs
            const pageToProductMap = {
                'elevate-details': 'icmk',
                // Add more mappings as needed
            };
            
            const productId = pageToProductMap[pageName] || 'icmk';
            
            const product = {
                id: productId,
                name: productTitle,
                price: productPrice,
                image: productImage,
                quantity: quantity
            };
            
            // Add to cart and redirect to checkout
            addToCart(product);
            window.location.href = 'checkout.html';
        });
    }

    // Initialize cart display
    updateCartDisplay();
    renderCart();
});