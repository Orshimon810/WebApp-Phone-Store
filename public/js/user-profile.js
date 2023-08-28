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

      // ... (your existing order fetching logic)
  });

  const profileEditForm = document.getElementById('profile-edit-form');
  profileEditForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const updatedData = {
          name: document.getElementById('edit-name').value,
          email: document.getElementById('edit-email').value,
          street: document.getElementById('edit-street').value,
          apartment: document.getElementById('edit-apartment').value,
          city: document.getElementById('edit-city').value,
          zip: document.getElementById('edit-zip').value,
          country: document.getElementById('edit-country').value,
          phone: document.getElementById('edit-phone').value
      };

      try {
          const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
              method: 'PUT',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedData)
          });

          if (response.ok) {
              // Update the profile table with new data
              fetchUserDetails(userId);
              // Optionally, display a success message to the user
          } else {
              console.error('Failed to update user details.');
              // Optionally, display an error message to the user
          }
      } catch (error) {
          console.error('Error updating user details:', error);
      }
  });

// ...

const passwordChangeForm = document.getElementById('password-change-form');
passwordChangeForm.addEventListener('submit', async (event) => {
event.preventDefault();

const oldPassword = document.getElementById('old-password').value;
const newPassword = document.getElementById('new-password').value;
const confirmNewPassword = document.getElementById('confirm-new-password').value;

// Validate that new passwords match
if (newPassword !== confirmNewPassword) {
  const errorMessage = document.querySelector('.password-change-error-message');
  errorMessage.textContent = "New passwords don't match.";
  return;
}

// Validate old password
const oldPasswordData = {
  oldPassword
};

try {
  const response = await fetch(`http://localhost:3000/api/v1/users/${userId}/validate-password`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(oldPasswordData)
  });

  if (!response.ok) {
      const errorMessage = document.querySelector('.password-change-error-message');
      errorMessage.textContent = 'Old password is incorrect.';
      return;
  }
} catch (error) {
  console.error('Error validating old password:', error);
}

const newPasswordData = {
  newPassword
};

try {
  const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
      method: 'PUT',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPasswordData)
  });

  if (response.ok) {
      const successMessage = document.querySelector('.password-change-message');
      successMessage.textContent = 'Password changed successfully.';
      // Clear the form fields
      document.getElementById('old-password').value = '';
      document.getElementById('new-password').value = '';
      document.getElementById('confirm-new-password').value = '';
  } else {
      const errorMessage = document.querySelector('.password-change-error-message');
      errorMessage.textContent = 'Failed to change password.';
  }
} catch (error) {
  console.error('Error changing password:', error);
}
});




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
              document.getElementById('user-name').textContent = userDetails.name;
              document.getElementById('user-email').textContent = userDetails.email;
              document.getElementById('user-street').textContent = userDetails.street;
              document.getElementById('user-apartment').textContent = userDetails.apartment;
              document.getElementById('user-city').textContent = userDetails.city;
              document.getElementById('user-zip').textContent = userDetails.zip;
              document.getElementById('user-country').textContent = userDetails.country;
              document.getElementById('user-phone').textContent = userDetails.phone;
          } else {
              console.error('Failed to fetch user details.');
          }
      } catch (error) {
          console.error('Error fetching user details:', error);
      }
  }

  fetchUserDetails(userId);