var map;
var service;
var searchRadius;
var geocoder;
var markers = [];
var distance;
var currentLocation = {};

var nearbyPlaces = [];

// code starts here. begins by making map, finding your current location, and starts the search
function initMap() {

  getInformation();

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: getZoom(),
    disableDefaultUI: true,
    backgroundColor: "#ffd600",
    draggable: false,
    disableDoubleClickZoom: true,
    gestureHandling: "none"
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(currentLocation);
      var image = 'https://momja.github.io/dineDice/images/white-marker-shadow.png';
      var marker = new google.maps.Marker({
        map: map,
        position: currentLocation,
        icon: image
      });

      var radiusOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.1,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.075,
            map: map,
            center: currentLocation,
            radius: searchRadius
        };
        // Add the circle for this city to the map.
        cityCircle = new google.maps.Circle(radiusOptions);
        performSearch();
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
  geocoder = new google.maps.Geocoder;
}

function getInformation() {
  searchRadius = parseInt(sessionStorage.getItem("radius")) || 3;
}

function getZoom() {
  if (searchRadius < 1000) {
    return 13;
  }
  else if (searchRadius < 5000) {
    return 12;
  }
  else if (searchRadius < 10000) {
    return 11;
  }
}

function performSearch() {
  var min_price = sessionStorage.getItem("minprice");
  var max_price = sessionStorage.getItem("maxprice");
  var request = {
    location: map.getCenter(),
    radius: searchRadius,
    type: 'restaurant',
    minPriceLevel: min_price,
    maxPriceLevel: max_price
  };
  service.nearbySearch(request, callback);
}

function callback(results, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        for (var i = 0, result; result = results[i]; i++) {
          addMarker(result);
        }
        findPlace();
}

function addMarker(place) {
  nearbyPlaces.push(place);
  var image = 'https://momja.github.io/dineDice/images/pink-marker-shadow.png';
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: image
  });
  markers.push(marker);
}

function addInfoWindow(marker, option, rating, distance, foodImage, link, price) {
  var contentString = `<h1>${option}</h1>` +
    `<div><div style='float:right;'><img src=${foodImage}></div><p>rating: ${rating} <br> distance: ${distance}` +
    `</p> <p>price: ${price}</div>` +
    `<p><a href=${link}>Directions</a></p>`;

  infoWindow.setContent(contentString);
  infoWindow.open(map, marker)
  map.panTo(marker.getPosition());
}

function findPlace() {
  var randomChoice = Math.floor(Math.random() * nearbyPlaces.length);
  place = nearbyPlaces[randomChoice];
  console.log("place found:" + place.name);
  if (place.rating >= 3.0) {
    getDistance(place, markers[randomChoice]);
  }

  else {
    findPlace();
  }

}

function getDistance(place, marker) {
  var matrixService = new google.maps.DistanceMatrixService;
  matrixService.getDistanceMatrix(
    {
      origins: [currentLocation],
      destinations: [place.geometry.location],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.IMPERIAL
    }, callback);
  function photo() {
    if (typeof place.photos !== 'undefined') {
      return place.photos[0].getUrl({'maxWidth': 150, 'maxHeight': 150})
    }
    else {
      return "https://momja.github.io/dineDice/images/No_Pictures.png"
    }
  };

  function price() {
    if (place.price_level == 1) {
      return "$";
    }
    else if (place.price_level == 2) {
      return "$$";
    }
    else {
      return "$$$";
    }
  }

  function callback(response, status) {
    if (status == 'OK') {
      var results = response.rows[0].elements;
      distance = results[0].distance.text;
      console.log(distance);
      var unspacedName;
      for (var i = 0; i < place.name.length; i++) {
        if (place.name[i] !== " ") {
          unspacedName += place.name[i];
        }
        else {
          unspacedName += "+";
        }
      }
      var link = "http://maps.apple.com/?" + "&sll=" + place.geometry.location.lat()+ "," +place.geometry.location.lng();
      addInfoWindow(marker, place.name, place.rating, distance, photo(), link, price());
    }
    else {
      alert("there has been an error " + status)
    }
  }
}

//Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-85764709-2', 'auto');
ga('send', 'pageview');
//End Google Analytics
