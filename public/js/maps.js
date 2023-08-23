// Load Google Maps API and initialize map
function loadGoogleMapsScript() {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDGYBpcdK4QppxybDr2SRWDeFkT4HXos8I&callback=initMap"; // Replace with your API key
    document.head.appendChild(script);
}

function initMap() {
    var options = {
        center: { lat: 31.97032915755696, lng: 34.77212580873798 },
        zoom: 9
    };

    var map = new google.maps.Map(document.getElementById("map"), options);
    const token = localStorage.getItem('token');
    
    $.ajax({
        url: "http://localhost:3000/api/v1/branch", // Replace with your API endpoint
        type: "GET",
        headers: {
            Authorization: `Bearer ${token}` // Replace with your actual token
        },
        success: function (data) {
            data.forEach(branch => {
                var coordinates = branch.coordinates.replace(" ", "").split(',');
                var marker = new google.maps.Marker({
                    position: { lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1]) },
                    map: map,
                    title: branch.address
                });

                var infoWindow = new google.maps.InfoWindow({
                    content: `<strong>Phonebook Store</strong><br>${branch.address}`
                });

                marker.addListener("click", function () {
                    infoWindow.open(map, marker);
                });
            });
        },
        error: function (error) {
            console.error("Error fetching data:", error);
        }
    });
}

// Load Google Maps API and initialize the map when the script is loaded
loadGoogleMapsScript();
