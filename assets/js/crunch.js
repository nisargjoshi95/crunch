var map, geocoder, infowindow, time, radius, zoom, price, marker, lat, lng, lat, lng, displayTime, restaurantName;
var filter = false;
var places = [];

$(document).ready(function() {
    $('select').material_select();

    //initial map and geolocation
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
        center: new google.maps.LatLng(30.2669444, -97.7427778),
        zoom: 12,
        el: '#map',
    };
    map = new google.maps.Map(mapCanvas, mapOptions);

    var infoWindow = new google.maps.InfoWindow({ map: map });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            setTimeout(function() { infoWindow.close(); }, 3000);
            map.setCenter(pos);
            //get location
            console.log(pos.lat + "," + pos.lng);
            $('#currentLoc').val(pos.lat + "," + pos.lng);

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed. Please enter your address manually' :
            'Error: Your browser doesn\'t support geolocation.Please enter your address manually');
        setTimeout(function() { infoWindow.close(); }, 3000);
    }


    //autocomplete for currentLoc
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(30.136290, -97.945014),
        new google.maps.LatLng(30.536753, -97.559441));
    var input = document.getElementById('currentLoc');
    var options = {
        bounds: defaultBounds,
        types: ['address']
    };
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', fillInAddress);

    function fillInAddress() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
        console.log(place);
    }
    // on click, mark startpoint with a marker and recenter to currentLoc

    codeAddress();

    //marker
    $('#search').on('click', function() {

        $('#restart').show();
        $('#restart').css('display', 'inline-block');
        $('select').material_select();

        // Throw red borders if user does not make a selection
        var incomplete = false;
        if ($('#foodCategory').val() === '') {
            $('#foodDiv').css('border', 'solid red 2px');
            incomplete = true;
        } else {
            $('#foodDiv').css('border', 'none');
        }
        if ($('#currentLoc').val() === '') {
            $('#locationDiv').css('border', 'solid red 2px');
            incomplete = true;
        } else {
            $('#locationDiv').css('border', 'none');
        }
        if ($('#time').val() === null) {
            $('#timeDiv').css('border', 'solid red 2px');
            incomplete = true;
        } else {
            $('#timeDiv').css('border', 'none');
        }
        if ($('#travel').val() === null) {
            $('#travelDiv').css('border', 'solid red 2px');
            incomplete = true;
        } else {
            $('#travelDiv').css('border', 'none');
        }
        if ($('#price').val() === null) {
            $('#priceDiv').css('border', 'solid red 2px');
            incomplete = true;
        } else {
            $('#priceDiv').css('border', 'none');
        }

        if (incomplete) {
            $('#incomplete').show();
        } else {
            $('#incomplete').css('display', 'none');
        }

        codeAddress();
    });

    $('#restart').on('click', function() {
        resetVariables();
        $('#travelDiv').css('border', 'none');
        $('#timeDiv').css('border', 'none');
        $('#locationDiv').css('border', 'none');
        $('#priceDiv').css('border', 'none');
        $('#foodDiv').css('border', 'none');
        $('#incomplete').hide();
    });
    //animate Route
    $(document.body).on('click', '#select', function() {
        map = new GMaps({
            el: '#map',
            lat: map.getCenter().lat(),
            lng: map.getCenter().lng(),
            zoom: 14
        });
        console.log(map);
        $('#display').append('You have chosen ' + restaurantName + '<br>' + 'The estimated on way travel time is ' + displayTime + '<br>' + 'Enjoy your meal!');

        $('#back').show();
        $('#back').css('display', 'inline-block');
        $('select').material_select();
        map.travelRoute({
            origin: [map.getCenter().lat(), map.getCenter().lng()],
            destination: [lat, lng],
            travelMode: 'driving',
            step: function(e) {
                $('#instructions').append('<li>' + e.instructions + '</li>');
                $('#instructions li:eq(' + e.step_number + ')').delay(450 * e.step_number).fadeIn(200, function() {
                    map.drawPolyline({
                        path: e.path,
                        strokeColor: '#598234',
                        strokeOpacity: 0.6,
                        strokeWeight: 6
                    });
                });
            }
        });
    });



});

function resetVariables() {
    //$('#currentLoc').val('');
    $('#foodCategory').val('');
    //$('#time').val(0);
    //$('#time').attr('selectedIndex', 0);
    $('#travel').attr('selectedIndex', 0);
    $('#price').attr('selectedIndex', 0);
    $('#price').val(0);
    $('#travel').val(0);
    $('#restart').css('display', 'none');
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
        center: new google.maps.LatLng(30.2669444, -97.7427778),
        zoom: 12,
        el: '#map',
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
    $('#display').html('');
    $('#instructions').html('');
    places = [];
    $('select').material_select();
}

$('#back').on('click', function() {
    $('#back').hide();
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
        center: new google.maps.LatLng(30.2669444, -97.7427778),
        zoom: 12,
        el: '#map',
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
    $('#display').html('');
    $('#instructions').html('');
    //codeAddress();
    for (var i = 0; i < places.length; i++) {
        createMarker(places[i]);
    }
    zoom = 16 - time / 15;
    map.setZoom(zoom);
    //experimental
    geocoder = new google.maps.Geocoder();
    var address = $('#currentLoc').val().trim();
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status == 'OK') {
            var img = {
                url: 'http://icons.iconarchive.com/icons/david-renelt/little-icon-people/32/Women-icon.png',
                scaledSize: new google.maps.Size(35, 35)
            };
            var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                animation: google.maps.Animation.DROP,
                icon: img
            });
            marker.setMap(map);
            map.setCenter(results[0].geometry.location);
            map.setZoom(zoom);
        }

    });
});

function codeAddress() {
    time = parseInt($('#time').val());
    radius = time / 15 * 1000;
    zoom = 16 - time / 15;
    price = parseInt($('#price').val());
    geocoder = new google.maps.Geocoder();
    var address = $('#currentLoc').val().trim();
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status == 'OK') {
            var img = {
                url: 'http://icons.iconarchive.com/icons/david-renelt/little-icon-people/32/Women-icon.png',
                scaledSize: new google.maps.Size(35, 35)
            };
            var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                animation: google.maps.Animation.DROP,
                icon: img
            });
            marker.setMap(map);
            map.setCenter(results[0].geometry.location);
            map.setZoom(zoom);
            map.center = results[0].geometry.location;
            //search nearby restaurants by key terms and set markers and infowindows
            var keyTerm = $('#foodCategory').val().trim();
            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: map.center,
                radius: radius,
                type: ['restaurant'],
                name: keyTerm
            }, callback);

            function callback(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // TO DO: sort results based on distance

                    // Here we splice out results that are too far based on user input and traffic
                    var maxTime = parseInt($('#time').val());
                    for (let i = 0; i < results.length; i++) {
                        getTime(results[i], function(error, time) {
                            if (error) return;

                            // Take the first 2 digits of the time string, parse to integer, and double it to get round-trip minutes
                            var totalTime = 2 * parseInt(time.substr(0, 2));
                            if (totalTime < maxTime) {
                                if ((results[i].rating > 2.5 && (parseInt(results[i].price_level) <= price) || results[i].price_level === 'undefined')) {
                                    console.log(results[i]); // CHANGE THIS
                                    // create our marker and get the yelp image
                                    var img;
                                    getYelp(results[i].name, results[i].vicinity, function(error, data) {
                                        var keywords = data.businesses[0].categories;
                                        if (error) return;
                                        if (data.businesses.length == 0) return;
                                        img = (data.businesses[0].image_url);
                                        if (!filter) {
                                            createMarker(results[i], img);
                                            places.push(results[i]);
                                        }
                                        //console.log(img); // CHANGE THIS TO DO WHAT WE WANT WITH THE YELP IMAGES
                                    });

                                }
                            }
                        });

                    }
                } else {
                    noResults();
                }
            }
        }
    })
}

function getTime(place, callback) {

    var start = $('#currentLoc').val().trim();
    var end = place.geometry.location;
    var travel = $('#travel').val().trim().toUpperCase();

    var request = {
        origin: start,
        destination: end,
        drivingOptions: {
            departureTime: new Date(),
            trafficModel: 'pessimistic'
        },
        travelMode: travel,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    };

    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(result, status) {
        // result object can be used to display the directions
        if (status == 'OK') {
            // Return travel time
            callback(null, result.routes[0].legs[0].duration.text);
        } else {
            callback('Status not okay.');
        }
    });
}

function createMarker(place, img) {


    var placeLoc = place.geometry.location;
    marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        // Here we get the travel time
        getTime(place, function(error, travelTime) {

            if (error) console.log('got an error', error);
            infowindow.setContent('<img border="0" src=' + img + ' style="width:200px;height:200px;">' + '<br> <b><center>' + place.name + '<br>' + travelTime + '<br>' +
                'price: ' + place.price_level + '<br>' + 'rating: ' + place.rating + '<br>' +
                '</b><button id="select">' + 'This is what I want' + '</button> </center>');
            displayTime = travelTime;
            restaurantName = place.name;
        });
        infowindow.open(map, this);
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();
    });
}

function clearMarkers() {
    setMapOnAll(null);
    marker = [];
}

function noResults() {
    var content = 'no results found';
    var infowindow = new google.maps.InfoWindow({
        content: content
    });
    infowindow.open(map, marker);
}
