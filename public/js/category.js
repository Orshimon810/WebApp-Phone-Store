
  $(document).ready(function() {
    // Get JWT token from local storage
    const jwtToken = localStorage.getItem('token');

    const productData = []; // Array to store fetched product data

    // Function to fetch products based on category and generate product boxes
    async function fetchAndGenerateProductBoxes(category) {
        try {
            let url = 'http://localhost:3000/api/v1/products';

            // Modify URL based on selected category
            if (category && category !== 'all') {
                url = `http://localhost:3000/api/v1/products/byCategory?categories=${category}`;
            }

             // Fetch products using authorization token
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const productContainer = document.querySelector('.product-container');
                productContainer.innerHTML = '';

                // Generate product boxes for each product
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
                });

                // Populate productData array with product information
                productData.push(...data.map(product => ({ id: product.id, name: product.name })));
                
                  // Add click event to product boxes
                $('.product-box').on('click', function() {
                    const productId = $(this).data('product-id');
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

    const categoryButtons = document.querySelectorAll('#button-container2 .btn');

    // Get category buttons and add click event listeners
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.value;
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            fetchAndGenerateProductBoxes(category);
        });
    });

    fetchAndGenerateProductBoxes(null);
});

