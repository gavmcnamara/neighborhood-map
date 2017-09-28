/*jshint -W069 */
// panorama from that and set the options
/* jshint ignore:start */
/*Disable Warning Justification:
    Using bracket notation so Google Closure Compiler
    ADVANCED_OPTIMIZATIONS will keep the original property names. */
/*jshint loopfunc:true */
/* global google, ko*/

var map;
// Function to initialize the map within the map div
var markersArray = [];

/***************************

My Model with array of locations

****************************/

// Create a single latLng literal object.
var locations = [
  {name: 'Pearls', location: { lat: 40.717955, lng: -73.95676 }},
  {name: 'Dotory', location: { lat: 40.70783, lng: -73.955655 }},
  {name: 'Umami Burger', location: { lat: 40.7159, lng: -73.9593 }},
  {name: 'McCarren Park', location: { lat: 40.721344, lng: -73.952636}},
  {name: 'Cooper Park', location: {lat: 40.7160, lng: -73.9373}},
  {name: 'Grand Ferry Park', location:{lat: 40.7166, lng: -73.9670}},
  {name: 'The Whisky Brooklyn', location: { lat: 40.72121, lng: -73.95656}},
  {name: 'Aligator Lounge', location: { lat: 40.713911, lng: -73.948922}},
  {name: 'The Brooklyn Brewery', location: { lat: 40.721645, lng: -73.957258}},
  {name: 'Harefield Road', location: {lat: 40.71462, lng: -73.943416}}
];

/********************

Personal map styles

********************/

  // Create a styles array to customize the map.
var styles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ff4400"
            },
            {
                "saturation": -68
            },
            {
                "lightness": -4
            },
            {
                "gamma": 0.72
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon"
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#0077ff"
            },
            {
                "gamma": 3.1
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "hue": "#00ccff"
            },
            {
                "gamma": 0.44
            },
            {
                "saturation": -33
            }
        ]
    },
    {
        "featureType": "poi.park",
        "stylers": [
            {
                "hue": "#44ff00"
            },
            {
                "saturation": -23
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "hue": "#007fff"
            },
            {
                "gamma": 0.77
            },
            {
                "saturation": 65
            },
            {
                "lightness": 99
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "gamma": 0.11
            },
            {
                "weight": 5.6
            },
            {
                "saturation": 99
            },
            {
                "hue": "#0091ff"
            },
            {
                "lightness": -86
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": -48
            },
            {
                "hue": "#ff5e00"
            },
            {
                "gamma": 1.2
            },
            {
                "saturation": -23
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "saturation": -64
            },
            {
                "hue": "#ff9100"
            },
            {
                "lightness": 16
            },
            {
                "gamma": 0.47
            },
            {
                "weight": 2.7
            }
        ]
    }
];

// This function uses jquery to show current weather in brooklyn
jQuery(document).ready(function($) {
  $.ajax({
  url : "http://api.wunderground.com/api/001aa3b1038e4ffb/geolookup/conditions/q/NY/Brooklyn.json",
  dataType : "jsonp",
  success : function(parsed_json) {
  var location = parsed_json['location']['city'];
  var temp_f = parsed_json['current_observation']['temp_f'];
  alert("Current temperature in " + location + " is: " + temp_f + " Farentheight");
  }
  });
});

/*************

creating map

*************/
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.721344, lng: -73.952636},
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

  var largeInfoWindow = new google.maps.InfoWindow();

  var bounds = new google.maps.LatLngBounds();
  map.fitBounds(bounds);

/**********

styling the markers

**********/

  // Style the markers a bit. This will be our locations marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

/***********

creating array markers

***********/

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var name = locations[i].name;
    // Create a marker per location and store in markers array.
    var marker = new google.maps.Marker({
     map: map,
     position: position,
     name: name,
     icon: defaultIcon,

     animation: google.maps.Animation.DROP,
    });

/**************

adding animation to markers and pushing markers into markersArray

***************/

  // Two event listeners, one for mouse over and one for mouse out
  // This will change the colors back and forth
  marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });
    // Push the marker to our array of markers
  markersArray.push(marker);

    // Extend the boundaries of the map for each marker
  bounds.extend(marker.position);

/****************

start of the infowindow

****************/

      // Create an onclick event to open an infowindow at each marker
  marker.addListener('click', function() {
    populateInfoWindow(this, largeInfoWindow);
  });
  }


  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

/******************************

Populating infowindow with googlemaps streetview API

******************************/
 // panorama from that and set the options

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;

      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a


      function getStreetView(data, status) {

        if (status == google.maps.StreetViewStatus.OK) {

          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div>' + marker.name + '</div><div id="pano"></div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.name + '</div>' +
            '<div>No Street View Found</div>');
        }
      }


      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }
  } /* jshint ignore:end */
}
/**********************

My viewModel with Knockout.js

***********************/

var vm =  {
     locations: ko.observableArray(locations),
     markersArray: ko.observableArray(markersArray)
 };


 vm.query = ko.observable('');
 vm.search = function(value){

    var tempLocations = [];
    var tempMarkers = [];

    for(var i = 0; i < locations.length; i ++) {
      if(locations[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        tempLocations.push(locations[i]);

    }
    for( var x = 0; x < markersArray.length; x ++) {
      if(markersArray[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
       markersArray[x].setMap(map);
      } else {
        markersArray[x].setMap(null);
      }
    }

    vm.locations(tempLocations);
    vm.markersArray(tempMarkers);
  }
};


vm.query.subscribe(vm.search);
ko.applyBindings(vm);


/*jshint +W069 */

