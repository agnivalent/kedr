var myMap, myPlacemark;

var init = function(){
	myMap = new ymaps.Map("map", {
		center: [55.76, 37.64],
        zoom: 9
    });

    myPlacemark = new ymaps.Placemark([55.66, 37.64], {}, {
    	iconLayout: 'default#image',
        iconImageHref: 'images/pin.png',
        iconImageSize: [21, 30],
        iconImageOffset: [-3, -42]
     });

    myMap.geoObjects.add(myPlacemark);
};

$(document).ready(function() {
	ymaps.ready(init);
});
