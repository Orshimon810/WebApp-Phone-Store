
        // Your token received after login
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        if (!token) {
        alert('You have to sign in first.');
        // Redirect to home page
        window.location.href = '../views/mainPage.html';
        }

        // Decode the token manually (alternative to jwt-decode library)
        function parseJwt(token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(base64));
        }

        const decodedToken = parseJwt(token);
        console.log('Decoded Token:', decodedToken);

        // Extract the user ID from the decoded token
        const userId = decodedToken.userId;
        console.log('User ID:', userId);

        // Fetch user orders using the user ID
        $(document).ready(function() {
            const apiUrl = `http://localhost:3000/api/v1/orders/get/userorders/${userId}`;
            console.log('API URL:', apiUrl);

            $.ajax({
                url: apiUrl,
                type: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the headers
            },
                dataType: 'json',
                success: function(data) {
                    console.log('Data received:', data);
                    // Populate the table with user orders
                    const orderList = document.getElementById('order-list');
                    data.forEach(order => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${order.id}</td>
                            <td>${order.orderItems.map(item => item.product.name).join(', ')}</td>
                            <td>₪${order.totalPrice.toLocaleString()} </td>
                            <td>${order.status}</td>
                            <td>${new Date(order.dateOrdered).toLocaleDateString()}</td>
                        `;
                        orderList.appendChild(row);
                    });
                },
                error: function(error) {
                    console.error('Error fetching user orders:', error);
                    console.log('Response status:', error.status);
                    console.log('Response text:', error.responseText);
                }
            });
        });


    // Fetch user details by ID and populate the table
    async function fetchUserDetails(userId) {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
            console.error('User is not logged in.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (response.ok) {
                const userDetails = await response.json();
                const attributeList = document.getElementById('attribute-list');

                const userRow = document.createElement('tr');
                userRow.innerHTML = `
                    <td>${userDetails.name}</td>
                    <td>${userDetails.email}</td>
                    <td>${userDetails.country}</td>
                    <td>${userDetails.phone}</td>
                `;

                attributeList.appendChild(userRow);
            } else {
                console.error('Failed to fetch user details.');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }

    fetchUserDetails(userId);
    