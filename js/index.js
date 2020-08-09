var map;
var searchRadius;
var geocoder;
var service;
var markers = [];
var distance;
var currentLocation = {};
var min_price;
var max_price;
var cityCircle;
var searchLocation;
var autocomplete;

var nearbyPlaces = [];

function searchBar() {
    var defaultBounds = new google.maps.LatLngBounds(currentLocation);
    var input = document.getElementById('search');
    var options = {
        bounds: defaultBounds
    }

    autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
  console.log("working");
    var place = autocomplete.getPlace();
    if (place.geometry) {
      searchLocation = place.geometry.location;
      map.setCenter(searchLocation);
    } else {
        document.getElementById('autocomplete').placeholder = 'Enter a city';
        searchLocation = currentLocation;
    }
}

function geocodeLatLng(location, callback) {
    var address = "";
    geocoder.geocode({'location': location}, function(results, status) {
        if (status === 'OK') {
            if (results[1]) {
              address = results[0].formatted_address;
              callback(address);
            }
            else {
              console.error("no results found");
            }
        }
        else {
            console.error('Geocoder failed due to: ' + status);
        }
    });
}

function setSearchToCurrentLoc() {
  console.log("setting to current location");
  geocodeLatLng(currentLocation, function(address) {
    document.getElementById("search").value = address;
  });
}

// set the information so the next page can make use of them, and they can be remembered
function setInformation() {
  var radiusinMiles = document.getElementById("distanceRange").value/10;
  var radiusinMeters = convertMilesToMeters(radiusinMiles);
  //sessionStorage.setItem("radius", radiusinMeters);
    searchRadius = radiusinMeters;

  if (document.getElementById("price_level_1").checked) {
    // price 1 and 2 are checked
    if (document.getElementById("price_level_2").checked) {
      //sessionStorage.setItem("minprice", "1");
      min_price = 1;
      //sessionStorage.setItem("maxprice", "2");
      max_price = 2;
    }
    // price 1 and 3 are checked
    else if (document.getElementById("price_level_3").checked) {
      //sessionStorage.setItem("minprice", "1");
      min_price = 1;
      //sessionStorage.setItem("maxprice", "3");
      max_price = 2;
    }
    // only price 1 is checked
    else {
      //sessionStorage.setItem("minprice", "1");
      min_price = 1;
      //sessionStorage.setItem("maxprice", "1");
      max_price = 1;
    }
  }
  else if (document.getElementById("price_level_2").checked) {
    // price 2 and 3 are checked
    if (document.getElementById("price_level_3").checked) {
      //sessionStorage.setItem("minprice", "2");
      min_price = 2;
      //sessionStorage.setItem("maxprice", "3");
      max_price = 3;
    }
    // only price 2 is checked
    else {
      //sessionStorage.setItem("minprice", "2");
      min_price = 2;
      //sessionStorage.setItem("maxprice", "2");
      max_price = 2;
    }
  }
  // only price 3 is checked
  else {
    //sessionStorage.setItem("minprice", "3");
    min_price = 3;
    //sessionStorage.setItem("maxprice", "3");
    max_price = 3;
  }

  performSearch();
}

function convertMilesToMeters(miles) {
  return miles/0.000621371;
}

$(document).ready(function() {
  $('.outer-div .main .button').on('click', animation);
  $('.outer-div .map-page .back-button').on('click', animation);
});

function animation() {
  $('.outer-div').toggleClass('clicked');
}




// code starts here. begins by making map, finding your current location, and starts the search
function initMap() {

  getInformation();

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: getZoom(),
    disableDefaultUI: true,
    backgroundColor: "#ffffff",
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
      searchLocation = currentLocation;
      searchBar();
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }
  else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  infoWindow = new google.maps.InfoWindow();
  geocoder = new google.maps.Geocoder;
  service = new google.maps.places.PlacesService(map);
}

function getInformation() {
  searchRadius = parseInt(sessionStorage.getItem("radius")) || 3;
  //min_price = sessionStorage.getItem("minprice");
  //max_price = sessionStorage.getItem("maxprice");
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

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
  if (typeof cityCircle !== 'undefined') {
        cityCircle.setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

function nearbyPlacesNames() {
  var names = [];
  for (var i = 0; i < nearbyPlaces.length; i++) {
    names.push(nearbyPlaces[i].name);
  }
  return names;
}

function performSearch() {
  nearbyPlaces = [];
  clearMarkers();
  markers = [];
    map.setCenter(searchLocation);
    var image = 'https://momja.github.io/dineDice/images/white-marker-shadow.png';
    var marker = new google.maps.Marker({
        map: map,
        position: searchLocation,
        icon: image
    });

    var radiusOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.1,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.075,
        map: map,
        center: searchLocation,
        radius: searchRadius
    };
    // Add the circle for this city to the map.
    cityCircle = new google.maps.Circle(radiusOptions);
  var request = {
    location: searchLocation,
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
          nearbyPlaces.push(result);
          addMarker(result);
        }
        findPlace();
}

function addMarker(place) {
  var image = 'https://momja.github.io/dineDice/images/pink-marker-shadow.png';
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: image
  });
  markers.push(marker);
}

function addInfoWindow(marker, option, rating, distance, foodImage, link, price) {
  var contentString = `<h1 style='margin:0px;'>${option}</h1>` +
    `<div><div style='float:right; display:block;'><img src=${foodImage}></div><p>rating: ${rating} <br>distance: ${distance}` +
    `<br>price: ${price}` +
    `<br><a href=${link}>Directions</a></p></div>`;

  infoWindow.setContent(contentString);
  infoWindow.open(map, marker);
  map.setCenter(marker.getPosition());
  map.panBy(0, 1000);
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
      origins: [searchLocation],
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
