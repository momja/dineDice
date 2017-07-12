
var map;
var service;
var searchRadius;
var price;
var geocoder;
var markers = [];

var nearbyPlaces = [];


// code starts here. begins by making map, finding your current location, and starts the search
function initMap() {

  getInformation();

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: getZoom(),
    styles: [
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#232324"
            },
            {
                "lightness": "35"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffd600"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "hue": "#ffd600"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "weight": 0.9
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "hue": "#ffd600"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "hue": "#ffd600"
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "hue": "#ffd600"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "hue": "#ffd600"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#83cead"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#fee379"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#7fc8ed"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "hue": "#00baff"
            }
        ]
    }
],
    disableDefaultUI: true,
    backgroundColor: "#ffd600",
    draggable: false,
    disableDoubleClickZoom: true,
    gestureHandling: "none"
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);

      var image = 'https://momja.github.io/dineDice/images/white-marker-shadow.png';
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
  geocoder = new google.maps.Geocoder;
}

function getInformation() {
  searchRadius = parseInt(sessionStorage.getItem("radius") || 3);
  price = sessionStorage.getItem("price") || 2;
}

function getZoom() {
  if (searchRadius < 1000) {
    return 14;
  }
  else if (searchRadius < 5000) {
    return 12;
  }
  else if (searchRadius < 10000) {
    return 10;
  }
}

function performSearch(pos) {
  var request = {
    location: pos,
    radius: searchRadius,
    type: 'restaurant',
    minPriceLevel: price,
    maxPriceLevel: price
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

function addInfoWindow(marker, option, rating, foodImage, link) {
  var contentString = `<h1>${option}</h1>` +
    `<div><div style='float:right;'><img src=${foodImage}></div><p>rating: ${rating} <br> distance: xxx` +
    `</p></div>` +
    `<p><a href=${link}>Directions</a></p>`;

  infoWindow.setContent(contentString);
  infoWindow.open(map, marker)
  map.panTo(marker.getPosition());
}

function findPlace() {
  var randomChoice = Math.floor(Math.random() * nearbyPlaces.length);
  place = nearbyPlaces[randomChoice];
  console.log("place found:" + place.name);
  if (place.rating >= 3.0 && (place.name != "SUBWAY®Restaurants" && place.name != "McDonald's")) {
    var link = "http://maps.apple.com/?" + "q=" + place.name + "sll=" + place.geometry.location.lat()+","+place.geometry.location.lng();
    addInfoWindow(markers[randomChoice], place.name, place.rating, place.photos[0].getUrl({'maxWidth': 150, 'maxHeight': 150}), link);

  }

  else {
    findPlace();
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
