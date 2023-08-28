$(document).ready(function() {
    // Select elements using jQuery
    const searchInput = $('#searchInput');
    const autocompleteList = $('#autocompleteList');
    const searchErrorMessage = $('#searchErrorMessage');

    // Input event listener for search input
    searchInput.on('input', async function() {
        const productName = searchInput.val();

    // Reset the error message and autocomplete list
        searchErrorMessage.text('');
        autocompleteList.empty();

        if (productName) {
            try {
                // Make an API call to retrieve autocomplete suggestions
                const autocompleteResponse = await fetch(`http://localhost:3000/api/v1/products/autocomplete/${productName}`);
                const suggestions = await autocompleteResponse.json();

                if (autocompleteResponse.ok) {
                    // Populate autocomplete list with suggestions
                    suggestions.forEach(function(suggestion) {
                        const listItem = $('<li>').text(suggestion);
                        autocompleteList.append(listItem);
                    });
                } else {
                    console.error('Failed to retrieve autocomplete suggestions');
                }
            } catch (error) {
                console.error('Error retrieving autocomplete suggestions:', error);
            }
        }
    });

    // Click event listener for autocomplete list
    autocompleteList.on('click', 'li', async function(event) {
        const selectedSuggestion = $(this).text();

        try {
            // Make an API call to retrieve the product by name
            const response = await fetch(`http://localhost:3000/api/v1/products/getbyname/${selectedSuggestion}`);
            const product = await response.json();

            if (response.ok) {
                // Redirect to sproduct page with product ID as query parameter
                window.location.href = `sproduct.html?id=${product._id}`;
            } else {
                // Display error message to user
                searchErrorMessage.text('Product not found');
            }
        } catch (error) {
            console.error('Error searching for product:', error);
        }
    });
});
