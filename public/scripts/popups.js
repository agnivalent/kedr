var toggleDepositPopup = function(tab) {
	$(".overlay").toggle();
	$('#deposit-popup').toggle();

	changeTab($("#popup-tab-" + tab).children()[0]);
}

var changeVarToNormal = function(elem) {
	$("#popup-tab-0-block .var").removeClass('active');
	$(elem).addClass('active');
	$("#popup-tab-0-block .short").hide();
	$("#popup-tab-0-block .normal").show();
}

var changeVarToShort = function(elem) {
	$("#popup-tab-0-block .var").removeClass('active');
	$(elem).addClass('active');
	$("#popup-tab-0-block .short").show();
	$("#popup-tab-0-block .normal").hide();
}