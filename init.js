function init(GLOBAL, app, rest, $) { 
	$.parse.init({
		app_id : app, // <-- enter your Application Id here 
		rest_key : rest // <--enter your REST API Key here	
	});
	GLOBAL.app_id = app;
	GLOBAL.rest_key = rest;
}

init(this, "PEv4zEZB1HGEpYuCEcugGkD8msNaounrwF0B0YkD", "50jH7UU4YO6p188ln20eZwEjr7rIveQd1huNh1Kc", ("undefined" == typeof $) ? this : $); 
