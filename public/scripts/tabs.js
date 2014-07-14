var changeTab = function(elem) {
	$("#tabbar .active").removeClass('active');
	$(elem).parent().addClass('active');

	$("#tabbar .near-selected").removeClass('near-selected');
	if ($(elem).parent().hasClass('first')) {
		$(".outer-tabbar-left").addClass('near-selected');
	} else if($(elem).parent().hasClass('last')) {
		$(".outer-tabbar-right").addClass('near-selected');
	}

	$("#tabbar .left-to-actived").removeClass('left-to-active');
	$("#tabbar .right-to-actived").removeClass('right-to-active');
	if ($(elem).parent().next().length)
		$(elem).parent().next().addClass('right-to-active');
	if ($(elem).parent().prev().length)
		$(elem).parent().prev().addClass('left-to-active');

	var id = $(elem).parent().attr('id');
	$("#" + id + "-block").parent().children("[id$='-block']").addClass('display-none');
	$("#" + id + "-block").removeClass('display-none');
};