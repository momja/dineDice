// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infoWindow;
var service;
var searchRadius;
var currentPosition;

var nearbyPlaces = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]

  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);

      searchRadius = 5000;

      var radiusOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.1,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.075,
            map: map,
            center: currentPosition,
            radius: searchRadius
        };

        // Add the circle for this city to the map.
        cityCircle = new google.maps.Circle(radiusOptions);

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

  google.maps.event.addDomListener(window, 'load', performSearch);
}

function performSearch() {
  var request = {
    location: currentPosition,
    radius: searchRadius,
    type: ['restaurant']
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
  service.getDetails(place, function(result, status) {
    nearbyPlaces.push(result.name);
  });
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);
    });
  });
}

function calculateReccommendation() {
  randomChoice = Math.floor(Math.random() * nearbyPlaces.length);
  var reccommendation = document.getElementById("option1");
  reccommendation.innerHTML = nearbyPlaces[randomChoice];
  nearbyPlaces.splice(randomChoice, 1);
}
