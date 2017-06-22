// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infoWindow;
var service;
var currentLocation;

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

      currentLocation = pos;

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  // The idle event is a debounced event, so we can query & listen without
  // throwing too many requests at the server.
  map.addListener('idle', performSearch);
}

function performSearch() {
        var request = {
          location: currentLocation,
          // distance in meters
          radius: '500',
          type: 'restaurant',
        };
        service.radarSearch(request, callback);
      }

function callback(results, status) {
    console.log(results.length);
    console.log(results);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {

            //Using setTimeout and closure because limit of 10 queries /second for getDetails */
            (function (j) {
                var request = {
                    placeId: results[i]['place_id']
                };

                service = new google.maps.places.PlacesService(map);
                setTimeout(function() {
                    service.getDetails(request, callback);
                }, j*1000);


            })(i);

            function callback(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    createMarker(place);
                    console.log(place.name +  results.length + nearbyPlaces.length);
                    nearbyPlaces.push(place);

                    if(results.length == agencies.length){
                        console.log(nearbyPlaces);
                        var request = new XMLHttpRequest();
                        request.open('POST', 'http://localhost/agency-map/src/save.php', true);
                        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                        request.send(JSON.stringify(nearbyPlaces));
                    }
                }
            }
        }
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
}
