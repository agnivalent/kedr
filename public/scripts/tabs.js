var changeTab = function(elem) {
	var tabbar = $(elem).closest('.tabbar');
	tabbar.find(".active").removeClass('active');
	$(elem).parent().addClass('active');

	tabbar.find(".near-selected").removeClass('near-selected');
	if ($(elem).parent().hasClass('first')) {
		tabbar.find(".outer-tabbar-left").addClass('near-selected');
	} else if($(elem).parent().hasClass('last')) {
		tabbar.find(".outer-tabbar-right").addClass('near-selected');
	}

	tabbar.find(".left-to-actived").removeClass('left-to-active');
	tabbar.find(".right-to-actived").removeClass('right-to-active');
	if ($(elem).parent().next().length)
		$(elem).parent().next().addClass('right-to-active');
	if ($(elem).parent().prev().length)
		$(elem).parent().prev().addClass('left-to-active');

	var id = $(elem).parent().attr('id');
	$("#" + id + "-block").parent().children("[id$='-block']").addClass('display-none');
	$("#" + id + "-block").removeClass('display-none');
};