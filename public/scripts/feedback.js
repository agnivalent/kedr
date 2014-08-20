$(document).ready(function() {
	$('.feedback-form form').validate({
			errorLabelContainer: $(".feedback-form .error")
		});
$('.feedback-form form').submit(function () {
 	// sendContactForm();
 	if($('.feedback-form form').valid()) {
 		$.post('/api/mailer', $('.feedback-form form').serialize(), function() {
 			alert('Ваше сообщение было успешно послано.');
 		});
 	}

 	return false;
});
});
