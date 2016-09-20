var yelpResults;

$(document).ready(function() {
    $('select').material_select();


  // MAP
  var mapCanvas = document.getElementById("map");
  var mapOptions = {
    center: new google.maps.LatLng(30.2669444,-97.7427778),
    zoom: 12
  };
  var map = new google.maps.Map(mapCanvas, mapOptions);

  // AUTO-COMPLETE
  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-124.626080, 18.005611),
    new google.maps.LatLng(-62.361014, 48.987386));
  var placeInput = document.getElementById("currentLoc");
  var options = {
    bounds: defaultBounds,
    types: ['address']
  };
  var autocomplete = new google.maps.places.Autocomplete(placeInput, options);
  autocomplete.addListener('place_changed', fillInAddress);

  function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    console.log(place);
  }

  $('#submitButton').on('click', function() {
    // We use a promise because getYelp is asynchronous 
    var promise = getYelp($('#foodCategory').val().trim(), $('#currentLoc').val().trim());

    promise.success(function (data) {

      yelpResults = data.businesses;
      
      var latitude = yelpResults[0].location.coordinate.latitude;
      var longitude = yelpResults[0].location.coordinate.longitude;
      var image = yelpResults[0].image_url;
      var name = yelpResults[0].name;
      var url = yelpResults[0].url;
      var stars = yelpResults[0].rating;

      // yelpResults.splice(0,1);

    });

  })

});


