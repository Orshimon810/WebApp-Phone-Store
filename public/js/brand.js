         $(document).ready(function() {
            const jwtToken = localStorage.getItem('token'); // Replace with your actual JWT token
            const productData = [];
    
            // Function to fetch products and generate product boxes
            async function fetchAndGenerateProductBoxes(brand) {
                try {
                    let url = 'http://localhost:3000/api/v1/products';
                    if (brand) {
                        url = `http://localhost:3000/api/v1/products/byBrand?brand=${brand}`;
                    }
    
                    const response = await fetch(url, {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`
                        }
                    });
                    const data = await response.json();
    
                    if (response.ok) {
                        const productContainer = document.querySelector('.product-container');
                        productContainer.innerHTML = ''; // Clear existing content
    
                        data.forEach(product => {
                            const productBox = document.createElement('div');
                            productBox.className = 'product-box';
                            productBox.setAttribute('data-product-id', product.id);
                            productBox.innerHTML = `
                                <div class="product-img">
                                    <a href="#" class="add-cart"><i class="fas fa-shopping-cart"></i></a>
                                    <img src="${product.image}">
                                </div>
                                <div class="product-details">
                                    <a href="#" class="p-name">${product.name}</a>
                                    <span class="p-price">₪${product.price.toLocaleString()} </span>
                                </div>
                            `;
                            productContainer.appendChild(productBox);
    
                            // Store product ID and name in the array
                            productData.push({ id: product.id, name: product.name });
                        });
    
                        // Add a click event listener to the product boxes
                        $('.product-box').on('click', function() {
                            const productId = $(this).data('product-id');
                            // Find the product name by matching the ID
                            const productName = productData.find(product => product.id === productId)?.name;
                            if (productName) {
                                window.location.href = `sproduct.html?id=${productId}`;
                            }
                        });
                    } else {
                        console.error('Failed to fetch products');
                    }
                } catch (error) {
                    console.error('Error fetching products:', error);
                }
            }
    
            // Add click event listeners to the filter buttons
            const filterButtons = document.querySelectorAll('.btn');
    
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const brand = button.textContent.trim();
                    fetchAndGenerateProductBoxes(brand === 'Show all' ? null : brand);
    
                    // Remove 'active' class from other buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
    
                    // Add 'active' class to the clicked button
                    button.classList.add('active');
                });
            });
    
            // Display all products initially
            fetchAndGenerateProductBoxes(null);
        });
    