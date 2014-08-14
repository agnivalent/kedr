$(document).ready(function() {
$('.feedback-form form').submit(function () {
 	// sendContactForm();

var value1 = document.getElementById('name-field').value;
var value2 = document.getElementById('email-field').value;
 if (value1.length < 1 || value2.length < 4) {
 	alert ('Пожалуйста, заполните поля с вашим именем и Email.');
   return false; // keep form from submitting
 }
 else {


 	$.post('/api/mailer', $('.feedback-form form').serialize(), function() {
 		alert('Ваше сообщение было успешно послано.');
 	});

}
 	return false;
});
});