// Include Axios library
document.write('<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"><\/script>');

       $(document).ready(function() {
        const imageLabel = $('#image-label');
        const imageInput = $('#image');
        const imagePreview = $('#imagePreview');
        
        // Prevent default behavior of dropping outside the browser window
        $(window).on('dragover', function(e) {
            e.preventDefault();
        });
        
        $(window).on('drop', function(e) {
            e.preventDefault();
        });
        
        // Update label text when file is dragged over
        imageLabel.on('dragenter', function() {
            imageLabel.text('Drop the image here');
        });
        
        imageLabel.on('dragleave', function() {
            imageLabel.text('Drag and drop an image or click here');
        });
        
        // Handle dropped file
        imageLabel.on('drop', function(e) {
            e.preventDefault();
            const file = e.originalEvent.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                imageInput.prop('files', e.originalEvent.dataTransfer.files);
                imageLabel.text(file.name);
                imagePreview.attr('src', URL.createObjectURL(file)).show();
            } else {
                imageLabel.text('Invalid file type');
            }
        });
        
        // Handle input change
        imageInput.on('change', function() {
            if (imageInput[0].files.length > 0) {
                const file = imageInput[0].files[0];
                imageLabel.text(file.name);
                imagePreview.attr('src', URL.createObjectURL(file)).show();
            } else {
                imageLabel.text('Drag and drop an image or click here');
                imagePreview.hide();
            }
        });


        $('#addProductForm').submit(function(event) {
                event.preventDefault(); // Prevent the default form submission
                
                const formData = new FormData(this);

                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:3000/api/v1/products',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` 
                    },
                    data: formData,
                    contentType: false, 
                    processData: false, 
                    success: function(response) {
                        console.log('Product added successfully:', response);
                        alert('Product added successfully!');
                    },
                    error: function(error) {
                        console.error('Error adding product:', error);
                    }
                });
            });

        $('#deleteProduct').submit(function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        const productId = $('#deleteProductId').val(); // Get the product ID from the input
        console.log('product id: ',productId)
        $.ajax({
            type: 'DELETE',
            url: `http://localhost:3000/api/v1/products/${productId}`, 
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            },
            success: function(response) {
                console.log('Product deleted successfully:', response);
                $('#deleteProductId').val('');
                alert('Product deleted successfully');
            },
            error: function(error) {
                console.error('Error deleting product:', error);
            }
        });
    });

        $('#updateProduct').submit(function(event) {
            event.preventDefault(); 

            const productId = $('#productId').val(); // Get the product ID from the input
            const formData = new FormData(this); // Create a FormData object with the form data

            $.ajax({
                type: 'PUT', // Use the PUT HTTP method for updating
                url: `http://localhost:3000/api/v1/products/${productId}`, 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                },
                data: formData,
                processData: false, // Prevent jQuery from processing the data
                contentType: false, // Let jQuery determine the content type
                success: function(response) {
                    console.log('Product updated successfully:', response);
                    // You can perform any additional actions after a successful PUT here
                    alert('Product updated successfully');
                },
                error: function(error) {
                    console.error('Error updating product:', error);
                }
            });
        });
   
        const jwtToken = localStorage.getItem('token'); 

        // Function to fetch products and populate the table
        async function fetchAndPopulateProducts() {
            try {
                const response = await fetch('http://localhost:3000/api/v1/products', {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    const productTableBody = document.getElementById('productTableBody');

                    data.forEach(product => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${product._id}</td>
                            <td>${product.name}</td>
                            <td>${product.description}</td>
                            <td>${product.brand}</td>
                            <td>₪${product.price.toLocaleString()}</td>
                            <td>${product.countInStock}</td>
                            <td>${product.rating}</td>
                            <td>${product.dateCreated}</td>
                            <td><img src="${product.image}" alt="${product.name}" style="max-width: 100px;"></td>
                        `;
                        productTableBody.appendChild(row);
                    });
                } else {
                    console.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        // Call the function to populate the table when the page is loaded
        fetchAndPopulateProducts();
    });

    const pageId = '122819594237799';
    const pageAccessToken = 'EAANwSEkrUugBOZBozQnjnli0qIUMfzRja8Ni8VQ4GxU8K2PbQNJC7JzwyzB7vE8fE93NFBn27Vqn7RXA6QwdyT8FWZAmkk4GQVKP1nrUsHrkdZBJytCIWKEcTaZAl99qPIntfZAxBpOy20MSIEsvuzCfuBtHz3lqLHQe3l2ZCFM6aAKa1AJZBL8PFMpohqYrtZAmWZCOeawL7YHqZB5wzUqDOS';
 

    document.addEventListener('DOMContentLoaded', function () {

    const productForm = document.getElementById('productForm');
    const productDetailsContainer = document.getElementById('productDetails');

    productForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const productId = document.getElementById('productId').value;
        getProductDetails(productId);
    });

    function getProductDetails(productId) {
    axios.get(`http://localhost:3000/api/v1/products/${productId}`)
    .then(response => {
        const product = response.data;

        // Post product details to Facebook
        const postData = {
            message: `Check out our new product:
        ${product.name}
        ${product.description}
        ---------------
        ${product.richDescription}`,  
            link: 'http://127.0.0.1:5500/views/mainPage.html',
        };

        axios.post(`https://graph.facebook.com/v17.0/${pageId}/feed`, null, {
            params: {
                access_token: pageAccessToken,
                ...postData,
            },
        })
        .then(response => {
            console.log('Post created:', response.data);
            productDetailsContainer.innerHTML = `<h1>Published successfully</h1>`;
        })
        .catch(error => {
            console.error('Error creating post:', error.response.data.error);
            productDetailsContainer.innerHTML = `<p>Error creating post: ${error.response.data.error.message}</p>`;
        });
    })
    .catch(error => {
        console.error('Error fetching product details:', error);
        productDetailsContainer.innerHTML = `<p>Product not found or invalid ID.</p>`;
    });
}

});
   