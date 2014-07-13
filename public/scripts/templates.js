
var offices;
var currentLocation;
var officesTemplate;
// var officeCoords = [];
// var officesCluster;

var setMapForAddress = function(address) {
    $.getJSON(geocodingRequestUrl(address), 
        function(json){ 
            var geoObject = extractFirstGeoObjectFromGeocodeResponse(json);
            myMap.setCenter(extractCoordsFromGeoObject(geoObject));
            myMap.setBounds(extractBoundsFromGeoObject(geoObject));
    });
};

var extractFirstGeoObjectFromGeocodeResponse = function(json) {
    return json.response.GeoObjectCollection.featureMember[0].GeoObject;
};

var extractCoordsFromGeoObject = function(geoObject) {
    return geoObject.Point.pos.split(" ").reverse();
};

var extractBoundsFromGeoObject = function(geoObject) {
    return [geoObject.boundedBy.Envelope.lowerCorner.split(" ").reverse(), 
            geoObject.boundedBy.Envelope.upperCorner.split(" ").reverse()];
};

var geocodingRequestUrl = function(address) {
    return "http://geocode-maps.yandex.ru/1.x/?format=json&amp;geocode=" + address;
};

var changeLocation = function(a) {
    var locationName = $(a).text();
    officeCoords = [];
    
    //set map centered on the location
    setMapForAddress(locationName);

    currentLocation = offices.locations.filter(function(val) {
        return val.name === locationName;
    })[0];

    var locationOffices = currentLocation.offices;

    var ajaxes = [];
    // var officeGeoObjects = [];
    $.each(locationOffices, function(i, office) {
        var xhr = $.ajax({
            url: geocodingRequestUrl(office.address),
            dataType: 'json'
        }).done(function(data) {
            // officeCoords.push(data.response);
            var geoObject = extractFirstGeoObjectFromGeocodeResponse(data);
            coords = extractCoordsFromGeoObject(geoObject);
            officeCoords.push(coords);

            office['coordinates'] = coords;


            // myMap.setBounds(extractBoundsFromGeoObject(geoObject));
            // if (i == locationOffices.length-1) elaborate(officeCoords);
        });
        ajaxes.push(xhr);
    });

    $.when.apply(null, ajaxes).done(function() {
        // $.each(officeCoords, function(i, office) {

        // });

        var myGeoObjects = [];

        //set markers on the map for offices
        $.each(officeCoords, function(i, coord){
            myGeoObjects[i] = new ymaps.GeoObject({
                geometry: {
                    type: "Point",
                    coordinates: coord
                }
            });
        });

        var myClusterer = new ymaps.Clusterer();
        myClusterer.add(myGeoObjects);  
        myMap.geoObjects.add(myClusterer);


        //put all offices for location to the side
        $("#location-offices").html(Mustache.render(officesTemplate, currentLocation));
    });

    


    
    
};

ymaps.ready(function() {
    var data;
    $.getJSON("scripts/offices.json", function(data) {
        // var template = $.get('#locations-template').html(); 
        offices = data;      

        $.get('templates/locations.mst', function(template) {
            var rendered = Mustache.render(template, data);
            $("#locations").html(rendered);
        });

        $.get('templates/location-offices.mst', function(template) {
            officesTemplate = template;
            var rendered = Mustache.render(template, data);
            $("#location-offices").html(rendered);
        });
    });    
});



