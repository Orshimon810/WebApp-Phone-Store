
const jwtToken = localStorage.getItem('token');

  async function updateProductStock(productId, newStock) {
          try {
              const response = await fetch(`http://localhost:3000/api/v1/products//update-count/${productId}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${jwtToken}`
                  },
                  body: JSON.stringify({ countInStock: newStock })
              });

              if (response.ok) {
                  console.log('Product stock updated successfully');
              } else {
                  console.error('Failed to update product stock');
              }
          } catch (error) {
              console.error('Error updating product stock:', error);
          }
      }

$(document).ready(function() {
// Retrieve cart data from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartContainer = $('#cart-container tbody');
const subtotalValue = $('.subtotal-value');
const totalValue = $('.total-value');
const shippingPrice = $('.shipping-price');
let shippingDetailsSubmitted = false;

if (!jwtToken) {
  alert('You have to log in first.');
  setTimeout(function() {
      window.location.href = '../views/mainPage.html';
  }, 500);
  return;
}

// Function to update cart totals
function updateCartTotals() {
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 50; // You can adjust the shipping cost as needed
  const total = subtotal + shipping;
  console.log(total)
  subtotalValue.text(`₪${subtotal.toFixed(2)}`);
  totalValue.text(`₪${total.toFixed(2)}`);
  shippingPrice.text(`₪${shipping.toFixed(2)}`);
}

// Function to update the cart icon with the number of items in the cart
function updateCartIcon() {
  const numCartItems = cart.length;
  $('.num-cart-producuts').text(numCartItems);
}

// Function to update the cart items display
function updateCartDisplay() {
  cartContainer.empty(); // Clear the existing content
  cart.forEach(item => {
      const cartItem = document.createElement('tr');
      cartItem.innerHTML = `
          <td><a href="#" class="remove-item" data-product-id="${item.id}"><i class="fas fa-trash-alt"></i></a></td>
          <td><img src="${item.image}" alt="${item.name}"></td>
          <td>
              <h5>${item.name}</h5>
          </td>
          <td>
              <h5>₪${item.price}</h5>
          </td>
          <td><h5 class="item-quantity">${item.quantity}</h5></td>
          <td>
              <h5 class="item-total">₪${(item.price * item.quantity).toFixed(2)}</h5>
          </td>
      `;
      cartContainer.append(cartItem);
  });
}

// Handle removing items from the cart
$('#cart-container').on('click', '.remove-item', function() {
  const productId = $(this).data('product-id');
  // Remove the item from the cart and update localStorage
  const updatedCart = cart.filter(item => item.id !== productId);
  console.log(updatedCart);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  // Remove the item from the displayed table
  $(this).closest('tr').remove();
  // Update cart total and subtotal
  updateCartTotals();
  // Update cart icon
  updateCartIcon();

  location.reload();
});

$('#shipping-form').on('submit', function(e) {
  e.preventDefault();
  shippingDetailsSubmitted = true;
  alert('Shipping details submitted successfully.');
});

$('#proceed-checkout').on('click', async function() {
  if (!shippingDetailsSubmitted) {
      alert('Please submit your shipping details first.');
      return;
  }

  if (cart.length === 0) {
      alert('Your cart is empty. Please add items to your cart before proceeding to checkout.');
      return;
  }

  // Collect order information and prepare order data
  const orderData = {
      // Include the userId in the order data
      user: getUserIdFromToken(),

      // Add the shipping details from the form
      shippingAddress1: $('.shippingAddress1').val(),
      shippingAddress2: $('.shippingAddress2').val(),
      city: $('.city').val(),
      country: $('.country').val(),
      zip: $('.zip').val(),
      phone: $('.phone').val(),
  };

  // Build the order items array
  const orderItems = cart.map(item => ({
      product: item.id,
      quantity: item.quantity
  }));

  // Add the order items data to the orderData object
  orderData.orderItems = orderItems;

  try {
      const response = await fetch('http://localhost:3000/api/v1/orders', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}` // Include the token in the headers
          },
          body: JSON.stringify(orderData)
      });

      if (response.ok) {
          // Update product stock
          const productIdToUpdate = cart.map(item => item.id);
          for (let i = 0; i < productIdToUpdate.length; i++) {
              await updateProductStock(productIdToUpdate[i]);
          }
          // Clear the cart and update the display
          localStorage.removeItem('cart');
          updateCartDisplay();
          updateCartIcon();

          // Show a success message or redirect the user
          alert('Order placed successfully!');
          // Redirect the user to a confirmation page or home page
          window.location.href = '../views/shop.html';
      } else {
          console.error('Failed to place order');
      }
  } catch (error) {
      console.error('Error placing order:', error);
  }
});

// Function to extract userId from JWT token
function getUserIdFromToken() {
  const token = localStorage.getItem('token'); // Get the JWT token from local storage
  if (token) {
      try {
          const tokenParts = token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          return payload.userId; // Extract userId from the payload
      } catch (error) {
          console.error('Error decoding token:', error);
      }
  }
  return null; // Return null if token is not available or invalid
}

// Initial updates on page load
updateCartTotals();
updateCartDisplay();
updateCartIcon();
});
