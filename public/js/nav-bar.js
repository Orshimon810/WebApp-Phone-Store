const isLoggedIn = localStorage.getItem('token');
const userPopup = $('.user-popup');

        // Search Bar
    $(document).on('click','.search',function(){
            $('.search-bar').addClass('search-bar-active')
        });

    $(document).on('click','.search-cancel',function(){
            $('.search-bar').removeClass('search-bar-active')
        });

        // Login and Signup Form
     $(document).on('click','.already-account,.sign-in',function(){
            $('.form').addClass('login-active').removeClass('sign-up-active')
        });

    $(document).on('click','.sign-up-btn,.sign-up',function(){
            $('.form').addClass('sign-up-active').removeClass('login-active')
        });

    $(document).on('click','.form-cancel',function(){
            $('.form').removeClass('login-active').removeClass('sign-up-active')
    });


        // Handle user icon click to show/hide the pop-up menu
    $(document).on('click', '.user', function(event) {
    if(isLoggedIn)
    {
      userPopup.toggleClass('show');
    }
    else{
        $('.form').addClass('login-active').removeClass('sign-up-active')

    }
    });
    $(document).on('click','.user', function(event) {
    if (!userPopup.is(event.target) && userPopup.has(event.target).length === 0) {
        userPopup.removeClass('hide');
    }
    });


// Check if the user is logged in
    $(document).ready(function() {

    if (isLoggedIn) {
      // Hide sign in and sign up links
      $('.sign-in').hide();
      $('.sign-up').hide();
  
      // Show logout options
      $('#logout').show();
    } else {
      // Show sign in and sign up links
      $('.sign-in').show();
      $('.sign-up').show();
  
      // Hide logout options
      $('#logout').hide();
      $('.user-popup').hide();
    }
  
    // Handle logout button click
    $(document).on('click', '.logout', function() {
      // Clear the token from local storage
      localStorage.removeItem('token');
  
      // Redirect to the homepage or another appropriate page
      window.location.href = '../views/mainPage.html'; // Replace with the desired URL
    });
     });
  
            // Log in method to DB
            document.getElementById('login').addEventListener('submit', function(event) {
                event.preventDefault();
            
                const formData = new FormData(event.target);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });
            
                // Send POST request to your API for sign in
                fetch('http://localhost:3000/api/v1/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(result => {
                    if (result.token) {
                        console.log('Sign in successful:', result);
                        console.log('token is ',result.token);
                        console.log('result is: ',result.isAdmin);
                        
                        // Save the token in local storage
                        localStorage.setItem('token', result.token);

                        // Registration successful
                        document.querySelector('.login-success-message').textContent = result.message;
                        document.querySelector('.login-error-message').textContent = '';
            
                        if(result.isAdmin){
                            alert('You will be redirected to Admin Panel');
                            window.location.href = 'adminPage.html'
                        }

                        

                        // Redirect to the specified URL
                        setTimeout(function() {
                            // Redirect to the specified URL
                            window.location.href = result.redirectUrl;
                        }, 500); // 500 milliseconds = 0.5 seconds
                         
                    } else {
                        // Login failed
                        document.querySelector('.login-success-message').textContent = '';
                        document.querySelector('.login-error-message').textContent = result; // Display error message here
                        // You can add other error handling here if needed
                    }
                })
                .catch(error => {
                    console.error('Login failed:', error);
                    document.querySelector('.login-error-message').textContent = 'The email adress or password is incorrect  . Please try again.';
                    document.querySelector('.login-success-message').textContent = ''; // Clear success message
                    // Add your error handling here
                });
            });
            
                
                    
            // Register method
                // Register method
            document.getElementById('register').addEventListener('submit', function(event) {
                event.preventDefault();
            
                const formData = new FormData(event.target);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });
            
                // Send POST request to your API
                fetch('http://localhost:3000/api/v1/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(result => {
                    if (result.message) {
                        // Registration successful
                        document.querySelector('.registration-success-message').textContent = result.message;
                        document.querySelector('.registration-error-message').textContent = '';
                        window.location.href = '../views/mainPage.html';
                        // You can add other handling here if needed
                    } else {
                        // Registration failed
                        document.querySelector('.registration-success-message').textContent = '';
                        document.querySelector('.registration-error-message').textContent = result; // Display error message here
                        // You can add other error handling here if needed
                    }
                })
                .catch(error => {
                    console.error('Registration failed:', error);
                    document.querySelector('.registration-error-message').textContent = 'An error occurred during registration. Please try again.';
                    document.querySelector('.registration-success-message').textContent = ''; // Clear success message
                    // Add your error handling here
                });
            });

            