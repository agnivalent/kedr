$(document).ready(function() {
	$('.feedback-form form').validate({
			errorLabelContainer: $(".feedback-form .error")
		});
$('.feedback-form form').submit(function () {
 	// sendContactForm();
 	$.post('/api/mailer', $('.feedback-form form').serialize(), function() {
 		alert('Ваше сообщение было успешно послано.');
 	});

 	return false;
});
});
