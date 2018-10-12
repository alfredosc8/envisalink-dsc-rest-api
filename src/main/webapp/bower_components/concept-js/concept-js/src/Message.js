function Message(config) {
	this.settings = config || {};
}

Message.prototype.showMessage = function(msg, config) {
	
	var options = this.settings;
	options = Object.assign(options, config);
	options.closeButton = true;
	
	/** OPTIONS **/ 
	//{progressBar: true, timeOut=5000, positionClass: 'toast-top-right'}
	
	setTimeout(function() {
		toastr.options = options;
		if (options.type == 'error') {
			toastr.error(msg);
		} else if (options.type == 'warning') {
			toastr.warning(msg);
		} else {
			toastr.success(msg);
		}

	}, 0);
};

Message.prototype.show = function(msg, config) {
	this.showMessage(msg, config);
}

Message.prototype.handleError = function(response) {
	this.showMessage(response.message, {type: 'error'});
	
	$(response.data).each(function(){
		Message.prototype.displayFieldError(this);
	});
};

Message.prototype.displayFieldError = function(error) {
	if (!error || !error.fieldId || !error.fieldDisplayName) {
		console.error('I cannot display the error for the field!');
		return;
	}

	var validator = $("form #"+ error.fieldId).closest('form').validate();
	var errors = {};
	errors[error.fieldDisplayName] = error.message;
	
	validator.showErrors(errors); 
};


Message.prototype.clearErrors = function(){
	$("label.error").each(function(){
		$(this).addClass('hide');
		$(this).parent().find('.form-control').removeClass('error');
	});
}