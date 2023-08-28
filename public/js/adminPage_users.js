
        const jwtToken = localStorage.getItem('token');

        $(document).ready(function () {
            
            // Function to fetch orders and populate the table
            function fetchAndPopulateUsers() {
                $.ajax({
                    url: 'http://localhost:3000/api/v1/users',
                    type: 'GET',
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    },
                    success: function (data) {
                        const userTableBody = $('#userTableBody');
                        userTableBody.empty();
                        
                        data.forEach(user => {
                            var permission;
                            if(user.isAdmin === true)
                            {
                                permission= 'Admin'
                            }
                            else{
                                permission ='user'
                            }
                            const row = `
                                <tr>
                                    <td>${user._id}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>${user.city} ${user.country}</td>
                                    <td>${user.phone}</td>
                                    <td>${permission}</td>
                                </tr>
                            `;
                            userTableBody.append(row);
                        });
                    },
                    error: function (error) {
                        console.error('Failed to fetch orders', error);
                    }
                });
            }

            // Call the function to populate the table when the page is loaded
            fetchAndPopulateUsers();


            $('#updateButton').click(function () {
        const userId = $('#userId').val();
        const newPassword = $('#newPassword').val();

        const userData = {
            password: newPassword
        };

        $.ajax({
            url: `http://localhost:3000/api/v1/users/${userId}`,
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            data: JSON.stringify(userData),
            success: function (updatedUser) {
                if (updatedUser.isAdmin) {
                    alert("You can't change an admin's password.");
                } else {
                    alert("Password changed.");
                }
            },
            error: function (error) {
                console.error('Failed to update user password', error);
            }
            });
                 });

                 $('#deleteButton').click(function () {
        const userIdToDelete = $('#deleteInp').val();
        if (!userIdToDelete) {
            alert("Please enter a valid user ID.");
            return;
        }

        $.ajax({
            url: `http://localhost:3000/api/v1/users/${userIdToDelete}`,
            type: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            },
            success: function (user) {
                if (user && user.isAdmin) {
                    alert("You can't delete an Admin!");
                } else {
                    // Display a confirmation dialog
                    const confirmed = confirm("Are you sure you want to delete the user?");
                    
                    if (confirmed) {
                        deleteUser(userIdToDelete);
                    }
                }
            },
            error: function (error) {
                console.error('Failed to fetch user data', error);
            }
        });
                });
                    //
                     }); 

            function deleteUser(userId) {
            $.ajax({
                url: `http://localhost:3000/api/v1/users/${userId}`,
                type: 'DELETE',
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                },
                success: function (response) {
                    if (response.success) {
                        alert("User deleted!");
                    } else {
                        alert("User not found.");
                    }
                },
                error: function (error) {
                    console.error('Failed to delete user', error);
                }
            });
            fetchAndPopulateUsers();
        }
       