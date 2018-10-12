/** You need to set the app's root in your main.jsp like below. 
  
 var app = new App({root: '/TeamConsole/', context: '/TeamConsole/Controller'});
 app.init()
 
 **/

function Navigator(){
	
	this.ctx = app.root;
	this.url = app.context;
	this.LANDING_PAGE = 'index.jsp';
	
	if (!this.ctx || !this.url)
		alert('You need to set the root="/Application/" and context="/Application/Controller". Set this in the js global scope!');
}

Navigator.prototype.loadJSP = function(path, callback){
	var parms = {};
	$.post(path, parms, function(xml) {
		if (typeof(callback) == "function") {
			callback(xml);
		}
    });
}

Navigator.prototype.call = function(url, json, successCB, errorCB, options){
	new Message().clearErrors();
	
	var headers = null;
	if (json && json.headers){
		headers = Object.assign({}, json.headers);
		json.headers = undefined;
		//returnType : 'JSP',
		// redirect: 'EditTripCrew.jsp',
	}
	
	
	if (json && url){
		json.nav = url;
		json = JSON.stringify(json);
	} else if (!json){
		var payload = {};
		payload.nav = url;
		json = JSON.stringify(payload);
	}
	
	this.callAjax(this.url, json, successCB, errorCB, headers, options);
};

Navigator.prototype.submit = function(action, form, exParms, successCB, errorCB, options){
	if ($(form).find("#nav").length === 0){
		$(form).append('<input id="nav" name="nav" type="hidden" value="'+ action +'">');
	}
	$(form).find("#action").val(action);
	
	var parms =  $( form ).serializeFormJSON();
	if (exParms){
		
		var headers = null;
		if (exParms.headers){
			headers = Object.assign({}, exParms.headers);
			exParms.headers = undefined;
			exParms.nav = undefined;
		}
		
		$.extend(parms, exParms);
	}

	var json = JSON.stringify(parms);

	this.callAjax(this.url, json, successCB, errorCB, headers, options);
};

Navigator.prototype.callAjax = function(uri, json, successCB, errorCB, headers, clientOptions){
		
	console.log(clientOptions ? clientOptions.async : true);
	
	$.ajax({
		url: uri,
		type: "POST",
		contentType: "application/json",
		data: json,
		async:  clientOptions ? clientOptions.async : true,
		headers: headers? headers: {},
		success: function(data, textStatus, jqXHR){
			if (!$.isPlainObject( data)){
				data = $.parseHTML(data, true);
			} else {
				data = data.data;
			}

			if (typeof(successCB) == "function") successCB(data);
		},
		error : function(jqXHR, textStatus, errorThrown){
			var response;
			try {
			    response = $.parseJSON(jqXHR.responseText);
			} catch(err) {		}
			
			if (jqXHR.status === 400) {
				
				if (typeof(errorCB) == "function"){
					errorCB(response);
				} else {
					message.handleError(response);
				}
				 
			} else {
				//if there is no message we simply redirect to ctx otherwise we display message first
				if (response && response.data.message){
					swal({
				        title: "Error",
				        text: response.data.message,
				        type: "error",
				        confirmButtonColor: "#DD6B55",
				        confirmButtonText: "OK",
				        closeOnConfirm: false
				    }, function () {
				    	window.location = app.root;
				    });
				} else {
					window.location = app.root;
				}
			}
		}
	});
}
