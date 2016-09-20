function getYelp(food, location) {

	var auth = {
		consumerKey : "hMC97H0A2CgiM4MYa2gf3g",
		consumerSecret : "zGmyoUjDxgCDqKo1cOHdm58uIZM",
		accessToken : "_7ylKqwyXglmBhVrA5OO6roNBSXcqr5b",
		// So apparently accessTokenSecret shouldn't be exposed like this on a real application
		// ...but it works
		accessTokenSecret : "Aab7UjEDOIUNb6eOBHx128OTz2g",
		serviceProvider : {
		signatureMethod : "HMAC-SHA1"
	}};

	// Set these to match user input  
	var terms = food;
	var near = location;

	var accessor = {
	consumerSecret : auth.consumerSecret,
	tokenSecret : auth.accessTokenSecret
	};

	parameters = [];
	parameters.push(['term', terms]);
	parameters.push(['location', near]);
	parameters.push(['callback', 'cb']);
	parameters.push(['oauth_consumer_key', auth.consumerKey]);
	parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
	parameters.push(['oauth_token', auth.accessToken]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

	var message = {
	'action' : 'http://api.yelp.com/v2/search',
	'method' : 'GET',
	'parameters' : parameters
	};

	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

	return $.ajax({
		'url' : message.action,
		'data' : parameterMap,
		'cache' : true,
		'dataType' : 'jsonp',
		'jsonpCallback' : 'cb',
		'success' : function(data, textStats, XMLHttpRequest) {
			// And now we have our JSON response
		}});
}
