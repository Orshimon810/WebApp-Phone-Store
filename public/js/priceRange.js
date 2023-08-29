
        $(document).ready(function() {
            // Get references to DOM elements
            const rangeInput = document.querySelectorAll(".range-input input");
            const priceInput = document.querySelectorAll(".price-input input");
            const progress = document.querySelector(".slider .progress");
            const productContainer = document.querySelector('.product-container');
    
            // Set the price gap for adjusting the range
            let PriceGap = 1000;
    
            // Function to fetch products based on price range
            function fetchProductsByPriceRange(minPrice, maxPrice) {
                const url = `http://localhost:3000/api/v1/products/getProductsByPriceRange?min=${minPrice}&max=${maxPrice}`;
    
                $.get(url, function(data) {
                    // Clear the existing products in the container
                    productContainer.innerHTML = "";
    
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
                    
                    $('.product-box').on('click', function() {
                        const productId = $(this).data('product-id');
                        // Redirect to the product details page with the product ID
                        window.location.href = `sproduct.html?id=${productId}`;
                    });
                });
            }
    
             // Event listeners for range input
            rangeInput.forEach(input => {
                input.addEventListener("input", (e) => {
                    let minVal = parseInt(rangeInput[0].value),
                        maxVal = parseInt(rangeInput[1].value);

                     // Check if the price gap is maintained
                    if (maxVal - minVal < PriceGap) {
                        if (e.target.className === "range-min") {
                            rangeInput[0].value = maxVal - PriceGap;
                        } else {
                            rangeInput[1].value = minVal + PriceGap;
                        }
                    } else {
                        // Update price input values
                        priceInput[0].value = minVal;
                        priceInput[1].value = maxVal;

                         // Update progress bar
                        progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
                        progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
    
                        // Fetch products based on the updated price range
                        fetchProductsByPriceRange(minVal, maxVal);
                    }
                });
            });
    
            // Event listeners for price input
            priceInput.forEach(input => {
                input.addEventListener("input", (e) => {
                    let minVal = parseInt(priceInput[0].value),
                        maxVal = parseInt(priceInput[1].value);
    
                    // Check if price gap is maintained and maximum value is within limit
                    if ((maxVal - minVal >= PriceGap) && maxVal <= 16000) {
                        if (e.target.className === "input-min") {
                            rangeInput[0].value = minVal;
                            progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
                        } else {
                            rangeInput[1].value = maxVal;
                            progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
                        }
    
                        // Fetch products based on the updated price range
                        fetchProductsByPriceRange(minVal, maxVal);
                    }
                });
            });
        });
   
    