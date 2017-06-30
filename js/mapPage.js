
var map;
var service;
var searchRadius;

var nearbyPlaces = [];

// code starts here. begins by making map, finding your current location, and starts the search
function initMap() {

  getInformation();

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}],
    disableDefaultUI: true
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);

      var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
      var marker = new google.maps.Marker({
        map: map,
        position: pos,
        icon: image
      });

      var radiusOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.1,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.075,
            map: map,
            center: pos,
            radius: searchRadius
        };
        // Add the circle for this city to the map.
        cityCircle = new google.maps.Circle(radiusOptions);

        performSearch(pos);

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }
  else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
}

function getInformation() {
  searchRadius = parseInt(sessionStorage.getItem("radius") || 5000);
  var price = sessionStorage.getItem("price") || 2;
}

function performSearch(pos) {
  var request = {
    location: pos,
    radius: searchRadius,
    type: 'restaurant'
  };
  service.radarSearch(request, callback);
}

function callback(results, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        for (var i = 0, result; result = results[i]; i++) {
          addMarker(result);
        }
}

function addMarker(place) {
  nearbyPlaces.push(place);
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    animation: google.maps.Animation.DROP
  });
}

function findPlace() {
  var randomChoice = Math.floor(Math.random() * nearbyPlaces.length);
  place = nearbyPlaces[randomChoice];

  service.getDetails(place, function(result, status) {
    console.log("place found:" + result.name);
    if (result.rating >= 3.0 && result.name != "SUBWAY®Restaurants") {
      var reccommendation = document.getElementById("option");
      reccommendation.innerHTML = result.name;

      var rating = document.getElementById("rating")
      rating.innerHTML = "rating: " + result.rating;
    }

    else {
      findPlace();
    }

  });
}
