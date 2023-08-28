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
        
            // Check if the user is an admin
            if (localStorage.getItem('isAdmin') === 'true') {
              $('.admin-link').show(); // Show the Admin link
            } else {
              $('.admin-link').hide(); // Hide the Admin link
            }
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
            
                        if (result.isAdmin) {
                            // Store the admin status in local storage
                            localStorage.setItem('isAdmin', true);
                        
                            alert('Admin connected');
                            setTimeout(function () {
                                window.location.href = result.redirectUrl;
                              }, 500); // 500 milliseconds = 0.5 seconds
                          } else {
                            // Store the admin status in local storage
                            localStorage.setItem('isAdmin', false);
                        
                            // Redirect to the specified URL
                            setTimeout(function () {
                              window.location.href = result.redirectUrl;
                            }, 500); // 500 milliseconds = 0.5 seconds
                          }
                         
                    } else {
                        console.log('Sign in failed:', result.message);
                        alert('Wrong email or password. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Sign in failed:', error);
                    alert('An error occurred during sign in. Please try again.');
                });
            });
            
                
                    
                // Register method
                $(document).ready(function() {
                    $('#register').submit(function(event) {
                        event.preventDefault();
                        
                        const formData = new FormData(this);
                        const data = {};
                        formData.forEach((value, key) => {
                            data[key] = value;
                        });
                        
                        // Send POST request to your API using jQuery
                        $.ajax({
                            url: 'http://localhost:3000/api/v1/users/register',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(data),
                            success: function(result) {
                                if (result.message) {
                                    // Registration successful
                                    $('.registration-success-message').text(result.message);
                                    $('.registration-error-message').text('');
                                    window.location.href = '../views/mainPage.html';
                                } else {
                                    // Registration failed
                                    $('.registration-success-message').text('');
                                    $('.registration-error-message').text(result); // Display error message here
                                }
                            },
                            error: function(error) {
                                console.error('Registration failed:', error);
                                $('.registration-error-message').text('An error occurred during registration. Please try again.');
                                $('.registration-success-message').text(''); // Clear success message
                            }
                        });
                    });
                });
                