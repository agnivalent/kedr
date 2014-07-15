var toggleDepositPopup = function(tab) {
	$(".overlay").toggle();
	$('#deposit-popup').toggle();

	changeTab($("#popup-tab-" + tab).children()[0]);
}

var changeVarToNormal = function(elem) {
	$(".popup .var").removeClass('active');
	$(elem).addClass('active');
	$(".popup .short").hide();
	$(".popup .normal").show();
}

var changeVarToShort = function(elem) {
	$(".popup .var").removeClass('active');
	$(elem).addClass('active');
	$(".popup .short").show();
	$(".popup .normal").hide();
}