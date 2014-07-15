var toggleDepositPopup = function(tab) {
	$(".overlay").toggle();
	$('#deposit-popup').toggle();

	changeTab($("#popup-tab-" + tab).children()[0]);
}