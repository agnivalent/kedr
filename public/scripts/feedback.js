$(document).ready(function() {
$('.feedback-form form').submit(function () {
 	// sendContactForm();
 	$.post('/api/mailer/', $('.feedback-form form').serialize());
 	return false;
});
});