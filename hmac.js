module.exports = function (key) {

	var crypto = require("crypto");

	return {

		// returns a base64 string containing the hmac and the message
		signMessage : function (message) {
			var hmac = crypto.createHmac("sha512",key);
			hmac.write(message);
			hmac.end();
			var buffer = Buffer.concat([hmac.read(),new Buffer(message)]);
			return buffer.toString("base64");
		},

		// accepts a base64 string from signMessage
		getVerifiedMessageText : function (signedMessage) {
			var buffer = new Buffer(signedMessage,"base64");
			var hmacDigest = buffer.slice(0,64);
			var message = buffer.slice(64).toString();
			var hmac = crypto.createHmac("sha512",key);
			hmac.write(message);
			hmac.end();
			if (hmac.read().toString("base64") === hmacDigest.toString("base64")) {
				return {
					valid : true,
					message : message
				};
			} else {
				return {
					valid : false
				};
			}
		}

	};

};
