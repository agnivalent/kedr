
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

// var stupidFilter = function(locations, name) {
//     for(var i; i < locations.length; i++ ) {
//         if (locations[i].name == name) {
//             return locations[i];
//         }
//     }
// }


var stupidFilter = function(locations, name) {
    var res;
    locations.forEach(function(element, i, a) {
        if(element.name == name) {
            res = element; 

        }
    });
    return res
};

var changeLocation = function(element) {
    if (offices == null) {
        setTimeout(changeLocation,1000);
    }
    
    var locationName = $(element).text();
    $('#locations .selected').removeClass('selected');
    $(element).addClass('selected');
    officeCoords = [];
    
    //set map centered on the location
    setMapForAddress(locationName);


    // currentLocation = offices.locations.filter(function(val) {
    //     return val.name === locationName;
    // })[0];

    currentLocation = stupidFilter(offices.locations, locationName);

    var locationOffices = currentLocation.offices;

    var ajaxes = [];
    var myGeoObjects = [];
    // var officeGeoObjects = [];
    $.each(locationOffices, function(i, office) {
        var xhr = $.ajax({
            url: geocodingRequestUrl(office.address),
            async: false,
            dataType: 'json'
        }).done(function(data) {
            // officeCoords.push(data.response);
            var geoObject = extractFirstGeoObjectFromGeocodeResponse(data);
            coords = extractCoordsFromGeoObject(geoObject);
            officeCoords.push(coords);

            office['coordinates'] = coords;
            office['bounds'] = extractBoundsFromGeoObject(geoObject);


            // myMap.setBounds(extractBoundsFromGeoObject(geoObject));
            // if (i == locationOffices.length-1) elaborate(officeCoords);
            myGeoObjects[i] = new ymaps.Placemark(office.coordinates,  {
                balloonContentBody: office.address,
                balloonContentHeader: office.name
            }, {
                iconLayout: 'default#image',
                iconImageHref: "images/pin_inactive.png",
                s_iconImageHref: "images/pin_inactive.png",
                a_iconImageHref: "images/pin_active.png",
                iconImageSize: [60,80],
                s_iconImageSize: [60,80],
                a_iconImageSize: [60,80],
                balloonOffset: [0,-65],
                iconImageOffset: [-15,-60],
                s_iconImageOffset: [-15,-60],
                a_iconImageOffset: [-15,-65],
                iconShadowImageOffset: [-15,-60],
                hideIconOnBalloonOpen: false
            });


        });
        ajaxes.push(xhr);
    });

    
        var MyIconContentLayout = ymaps.templateLayoutFactory.createClass('<div class="cluster-content">$[properties.geoObjects.length]</div>');
            
        var myClusterer = new ymaps.Clusterer({
            clusterIcons: [{
                    href: "images/stack.png",
                    size: [70, 42],
                    offset: [-35, -21]
                }],
                clusterIconContentLayout: MyIconContentLayout,
                clusterIconImageHref: "images/pin_inactive.png"
            
        });
        myClusterer.add(myGeoObjects);  
        myMap.geoObjects.add(myClusterer);
        // myMap.geoObjects.add(myGeoObjects);


        //put all offices for location to the side
        $("#location-offices").html(Mustache.render(officesTemplate, currentLocation));

    // $.when.apply(null, ajaxes).done(function() {
    //     // $.each(officeCoords, function(i, office) {

    //     // });

    //     var myGeoObjects = [];

    //     //set markers on the map for offices
    //     $.each(locationOffices, function(i, office){
    //         myGeoObjects[i] = new ymaps.Placemark(office.coordinates,  {
    //             balloonContentBody: office.address,
    //             balloonContentHeader: office.name
    //         }, {
    //             iconLayout: 'default#image',
    //             iconImageHref: "images/pin_inactive.png",
    //             s_iconImageHref: "images/pin_inactive.png",
    //             a_iconImageHref: "images/pin_active.png",
    //             iconImageSize: [60,80],
    //             s_iconImageSize: [60,80],
    //             a_iconImageSize: [60,80],
    //             balloonOffset: [0,-65],
    //             iconImageOffset: [-15,-60],
    //             s_iconImageOffset: [-15,-60],
    //             a_iconImageOffset: [-15,-65],
    //             iconShadowImageOffset: [-15,-60],
    //             hideIconOnBalloonOpen: false
    //         });

    //     });

    //     var MyIconContentLayout = ymaps.templateLayoutFactory.createClass('<div class="cluster-content">$[properties.geoObjects.length]</div>');
            
    //     var myClusterer = new ymaps.Clusterer({
    //         clusterIcons: [{
    //                 href: "images/stack.png",
    //                 size: [70, 42],
    //                 offset: [-35, -21]
    //             }],
    //             clusterIconContentLayout: MyIconContentLayout,
    //             clusterIconImageHref: "images/pin_inactive.png"
            
    //     });
    //     myClusterer.add(myGeoObjects);  
    //     myMap.geoObjects.add(myClusterer);
    //     // myMap.geoObjects.add(myGeoObjects);


    //     //put all offices for location to the side
    //     $("#location-offices").html(Mustache.render(officesTemplate, currentLocation));
    // });    
};

var selectOffice = function(element) {
    selectedOfficeName = $(element).text();

    selectedOffice = currentLocation.offices.filter(function(val) {
        return val.name === selectedOfficeName;
    })[0];

    //set map to display iffice location
    myMap.setCenter(selectedOffice.coordinates);
    myMap.setBounds(selectedOffice.bounds);

    //hide all other information blocks
    $('.office-info').addClass('display-none');
    $('#location-offices .selected').removeClass('selected');

    $(element).parent().addClass('selected');

    //display information block
    $(element).next().next().removeClass('display-none');

};

$(document).ready(function() {
ymaps.ready(function() {
    var data;
    $.getJSON("scripts/offices.json", function(data) {
        // var template = $.get('#locations-template').html(); 
        offices = data;

        $.get('templates/location-offices.mst', function(template) {
            officesTemplate = template;
            var rendered = Mustache.render(template, data);
            $("#location-offices").html(rendered);
        });      

        $.get('templates/locations.mst', function(template) {
            var rendered = Mustache.render(template, data);
            $("#locations").html(rendered);
            changeLocation($('#locations').children()[0]);
        });

        


    });    
});
});



