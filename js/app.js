var map;
// Function to initialize the map within the map div
var markersArray = [];

/***************************

My Model with array of locations

****************************/

// Create a single latLng literal object.
var locations = [
    {
        name: 'Dotory',
        location: {
            lat: 40.70783,
            lng: -73.955655
        },
        id: '52bf3053498e754b09a440b5',
        isShown: ko.observable(true)
    },
    {
        name: 'Umami Burger',
        location: {
            lat: 40.7159,
            lng: -73.9593
        },
        id: '54233f50498e70470c230a9e',
        isShown: ko.observable(true)
    },
    {
        name: 'McCarren Park',
        location: {
            lat: 40.721344,
            lng: -73.952636
        },
        id: '4081c500f964a52081f21ee3',
        isShown: ko.observable(true)
    },
    {
        name: 'Cooper Park',
        location: {
            lat: 40.7160,
            lng: -73.9373
        },
        id: '4a3ff382f964a52022a41fe3',
        isShown: ko.observable(true)
    },
    {
        name: 'The Whisky Brooklyn',
        location: {
            lat: 40.72121,
            lng: -73.95656
        },
        id: '4b6caaddf964a520ac4a2ce3',
        isShown: ko.observable(true)
    },
    {
        name: 'Aligator Lounge',
        location: {
            lat: 40.713911,
            lng: -73.948922
        },
        id: '411ff900f964a520290c1fe3',
        isShown: ko.observable(true)
    },
    {
        name: 'The Brooklyn Brewery',
        location: {
            lat: 40.721645,
            lng: -73.957258
        },
        id: '3fd66200f964a5205deb1ee3',
        isShown: ko.observable(true)
    },
    {
        name: 'Harefield Road',
        location: {
            lat: 40.71462,
            lng: -73.943416
        },
        id: '43bbc5fdf964a520f02c1fe3',
        isShown: ko.observable(true)
    },
    {
        name: 'George & Jacks Tap Room',
        location: {
            lat: 40.7180312,
            lng: -73.9551834
        },
        id: '3fd66200f964a520f3e81ee3',
        isShown: ko.observable(true)
    },
    {
        name: 'Whole Foods',
        location: {
            lat: 40.716165,
            lng: -73.95977
        },
        id: '57ffc2e438fad9d2a9122e23',
        isShown: ko.observable(true)
    },
    {
        name: 'The Craic Irish & Scottish Pub',
        location: {
            lat: 40.718624,
            lng: -73.955107
        },
        id: '54890c65498e646a6e088a86',
        isShown: ko.observable(true)
    },
    {
        name: 'Roebling Sports Bar',
        location: {
            lat: 40.717011,
            lng: -73.954648
        },
        id: '510edd2ce4b0bb3c6aacb533',
        isShown: ko.observable(true)
    }
];

/* jshint ignore:start */
/*************

creating map

*************/
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.721344,
            lng: -73.952636
        },
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

    var bounceIcon = google.maps.Animation.BOUNCE;

    /***********

    creating array markers

    ***********/

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var name = locations[i].name;
        var id = locations[i].id;
        // Create a marker per location and store in markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            name: name,
            icon: defaultIcon,
            id: id,

            animation: google.maps.Animation.DROP,
        });
        vm.locations()[i].marker = marker;
        var bouncingMarker = null;

        // clickListener creates function to bounce marker when clicked
        var clickListener = function() {
            if (bouncingMarker)
                bouncingMarker.setAnimation(null);
            if (bouncingMarker != this) {
                this.setAnimation(google.maps.Animation.BOUNCE);
                bouncingMarker = this;
            } else
                bouncingMarker = null;
        };

        google.maps.event.addListener(marker, 'click', clickListener);
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
        var onClick = marker.addListener('click', function() {
            myInfoWindow(this, largeInfoWindow);
            return onClick;
        });
    }




    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }

    /******************************

    Populating infowindow with googlemaps streetview API

    ******************************/
    // panorama from that and set the options

    // myInfoWindow populates the markers infowindow with foursquare API
    this.myInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;

            // Get location tips from foursquare API
            var locationComments = [];
            var FourSquareUrl = 'https://api.foursquare.com/v2/venues/' +
                marker.id +
                '/tips?sort=recent&limit=5&v=20171005&client_id=0XMZR5PS5LCN30GDMYO0VRUUCG1Q5EAC0B1B5SM2N1J1JLW3&client_secret=POUI4BOZYELESW0WE3Z5XKJIQ310GDJFBN2UY4SUF5CM4H31';

            $.getJSON(FourSquareUrl,
                function(marker) {
                    $.each(marker.response.tips.items, function(i, tips) {
                        locationComments.push('<li><h1>' + tips.text + '</h1><li>');
                    });

                }).done(function() {

            // window info from foursquare
                self.windowInfo = '<h2> What are people saying about ' + marker.name + ' ? </h2>' + '<strong>' + locationComments.join('') + '</strong>';
            }).fail(function(jqXHR, textStatus, errorThrown) {
                self.windowInfo = '<h2> What are people saying about ' + marker.name + ' ? </h2>' + '<h3>Ran into an issue... There has been a problem trying to retrieve the locatons info.</h3>';
            }).always(function() {
                infowindow.setContent(windowInfo);
            });
        }

        infowindow.open(map, marker);

        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    };
}

/**********************

My viewModel with Knockout.js

***********************/

var vm = {
    locations: ko.observableArray(locations),
    markersArray: ko.observableArray(markersArray)
};


vm.query = ko.observable('');
vm.showInfo = function(location) {
    google.maps.event.trigger(location.marker, 'click');
};

vm.search = function(value) {
    var self = this;

    for (var i = 0; i < locations.length; i++) {

        var match = locations[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0;
        vm.locations()[i].isShown(match);
        vm.locations()[i].marker.setVisible(match);

    }
};

function errorHandling() {
    alert("There has been an error loading google maps, please try again later.");
}

vm.query.subscribe(vm.search);
ko.applyBindings(vm);
