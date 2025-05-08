// Define product data that matches what's on the industrial page
const products = {
    'product1': {
      id: 'product1',
      name: 'Sling Medkit',
      price: 45000,
      category: 'Industrial',
      image: 'assets/img/shop/shop-6.png',
      quantity: 1
    },
    'small-medkit': {
      id: 'small-medkit',
      name: 'Individual Medkit',
      price: 12450,
      category: 'Industrial',
      image: 'assets/img/shop/shop-5.png',
      quantity: 1
    },
    'large-medkit': {
      id: 'large-medkit',
      name: 'Large Medkit',
      price: 63000,
      category: 'Industrial',
      image: 'assets/img/shop/shop-7.png',
      quantity: 1
    }
  };
  
  // Function to add a product to the cart
  async function addToCart(productId) {
    try {
      // Get the product details
      const product = products[productId];
      if (!product) {
        console.error('Product not found');
        return;
      }
      
      // Get current cart from localStorage or initialize empty cart
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Check if product is already in cart
      const existingProductIndex = cart.findIndex(item => item.id === productId);
      
      if (existingProductIndex !== -1) {
        // Increment quantity if product is already in cart
        cart[existingProductIndex].quantity += 1;
      } else {
        // Add new product to cart
        cart.push(product);
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Optional: Display a success message
      alert(`${product.name} added to cart successfully!`);
      
      // Optional: Update cart count in header
      updateCartCount();
      
      // If you also have a backend API, you can send the cart update there
      // await sendToServer(productId);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  }
  
  // Function to update cart count in the header
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update the cart count in header (assuming there's an element for this)
    // This might need adjustment based on your actual HTML structure
    const cartCountElement = document.querySelector('.header-cart-btn span');
    if (cartCountElement) {
      let totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cartCountElement.textContent = `₹${totalPrice.toLocaleString()}`;
    }
  }
  
  // Function to send cart update to the server (if needed)
  async function sendToServer(productId) {
    try {
      const userId = "12345"; // This should be the actual logged-in user's ID
      const response = await fetch('http://127.0.0.1:8000/cart/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          quantity: 1
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error updating server cart:', error);
      // Continue with local cart even if server update fails
    }
  }
  
  // Initialize cart count when page loads
  document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Add event listeners to all cart buttons on the page
    const cartButtons = document.querySelectorAll('.shop-list li a i.fa-regular.fa-cart-shopping');
    cartButtons.forEach(button => {
      const productItem = button.closest('.shop-item');
      const productTitle = productItem?.querySelector('.title a')?.textContent;
      
      let productId;
      if (productTitle === 'Sling Medkit') productId = 'product1';
      else if (productTitle === 'Individual Medkit') productId = 'small-medkit';
      else if (productTitle === 'Large Medkit') productId = 'large-medkit';
      
      if (productId) {
        button.closest('a').addEventListener('click', function(e) {
          e.preventDefault();
          addToCart(productId);
        });
      }
    });
  });