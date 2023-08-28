
        $(document).ready(function() {
            const jwtToken = localStorage.getItem('token'); 
    
            // Get the product ID from the URL query parameter
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
    
            // Fetch and populate product details
            async function fetchAndPopulateProductDetails() {
                try {
                    const response = await fetch(`http://localhost:3000/api/v1/products/${productId}`, {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`
                        }
                    });
                    const product = await response.json();
    
                    if (response.ok) {
                        document.getElementById('MainImg').src = product.image;
                        document.getElementById('productCategory').textContent = product.category.name;
                        document.getElementById('productName').textContent = product.description;
                        document.getElementById('productPrice').textContent = `₪${product.price.toLocaleString()}`;
                        document.getElementById('productDescription').textContent = product.richDescription;

                        // Add functionality to 'Add To Cart' button here
                        document.getElementById('addToCartBtn').addEventListener('click', () => {
                        addToCart(product);
                    });
                    } else {
                        console.error('Failed to fetch product details');
                    }
                } catch (error) {
                    console.error('Error fetching product details:', error);
                }
            }

            
    
            // Call the function to populate product details when the page is loaded
            fetchAndPopulateProductDetails();

             // Cart functionality
             function addToCart(product) {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(item => item.id === product.id);

                const productQuantity = parseInt(document.getElementById('productQuantity').value, 10);

                if (existingItem) {
                    existingItem.quantity += productQuantity; // Increment the quantity
                } else {
                    cart.push({ ...product, quantity: productQuantity }); // Add new item with specified quantity
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartIcon();

                // Show an alert and redirect the user to the shop page
                alert('Product added to cart! You will be redirected to the shop.');
                window.location.href = '../views/shop.html';
            }


            function updateCartIcon() {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const numCartItems = cart.reduce((total, item) => total + item.quantity, 0);
                $('.num-cart-producuts').text(numCartItems);
            }
            
        });
   