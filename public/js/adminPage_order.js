
const jwtToken = localStorage.getItem('token');

$(document).ready(function () {
    
    // Function to fetch orders and populate the table
    function fetchAndPopulateOrders() {
        $.ajax({
            url: 'http://localhost:3000/api/v1/orders',
            type: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            },
            success: function (data) {
                const orderTableBody = $('#orderTableBody');
                orderTableBody.empty();
                data.forEach(order => {
          
                    const row = `
                        <tr>
                            <td>${order.id}</td>
                            <td>${order.dateOrdered}</td>
                            <td>${order.user.name}</td>
                            <td>${order.shippingAddress1}</td>
                            <td>${order.status}</td>
                            <td>₪${order.totalPrice.toLocaleString()}</td>
                        </tr>
                    `;
                    orderTableBody.append(row);
                });
            },
            error: function (error) {
                console.error('Failed to fetch orders', error);
            }
        });
    }

    // Call the function to populate the table when the page is loaded
    fetchAndPopulateOrders();

    // Update an Order
    $('#updateButton').click(function () {
        const orderId = $('#inp').val();
        const selectedStatus = $('#statusSelect').val();

        $.ajax({
            url: `http://localhost:3000/api/v1/orders/${orderId}`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            data: JSON.stringify({ status: selectedStatus }),
            success: function (updatedOrder) {
                console.log('Order updated:', updatedOrder);
            },
            error: function (error) {
                console.error('Failed to update order', error);
            }
        });
        fetchAndPopulateOrders();

    });

    // Delete an Order
    $('#deleteButton').click(function () {
const orderIdToDelete = $('#deleteInp').val();

// Display a confirmation dialog
const confirmed = confirm('Are you sure you want to delete this order?');

if (confirmed) {
    $.ajax({
        url: `http://localhost:3000/api/v1/orders/${orderIdToDelete}`,
        type: 'DELETE',
        headers: {
            Authorization: `Bearer ${jwtToken}`
        },
        success: function (response) {
            console.log('Order deleted:', response);
        },
        error: function (error) {
            console.error('Failed to delete order', error);
        }
    });
}
fetchAndPopulateOrders();

});
});

$(document).ready(function () {
// View Order Details
$('#viewOrderButton').click(function () {
const orderId = $('#viewOrderId').val();

$.ajax({
    url: `http://localhost:3000/api/v1/orders/${orderId}`,
    type: 'GET',
    headers: {
        Authorization: `Bearer ${jwtToken}`
    },
    success: function (orderDetails) {
        console.log('Order details:', orderDetails);
        const viewOrderTableBody = $('#viewOrderTableBody');
        viewOrderTableBody.empty();

        orderDetails.orderItems.forEach(orderItem => {
            const row = `
                <tr>
                    <td>${orderItem.product.name}</td>
                    <td>${orderItem.quantity}</td>
                    <td>₪${orderItem.product.price.toLocaleString()}</td>
                </tr>
            `;
            viewOrderTableBody.append(row);
        });

    },
    error: function (error) {
        console.error('Failed to fetch order details', error);
    }
});
});
});

