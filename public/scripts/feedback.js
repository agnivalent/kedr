$(document).ready(function() {
$('.feedback-form form').submit(function () {
 	// sendContactForm();

var value = document.getElementById('area-field').value;
 if (value.length < 10) {
 	alert ('Пожалуйста, заполните поле с номером телефона.');
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