var Promise = require("./promise.js");
var crypto = require("crypto");

module.exports = function (secretKey) {

	var Session = function (signedMessageId) {
		var message;
		if (signedMessageId !== undefined) {
			var verificationResult = hmac.getVerifiedMessageText(signedMessageId);
			if (verificationResult.valid === true) {
				message = verificationResult.message;
				if (message.length === Session.idLength) {
					this.id = message;
				}
			}
		}
	};

	Session.prototype.getId = function () {
		if (this.getIdPromise !== undefined) {
			return this.getIdPromise;
		}

		var promise = new Promise;
		this.getIdPromise = promise;

		var self;

		if (this.id !== undefined) {
			promise.resolve(this.id);
		} else {
			self = this;
			Session.getNewId().then(function (id) {
				self.id = id;
				promise.resolve(id);
			},function (error) {
				promise.reject(error);
			});
		} 

		return promise;
	};

	Session.prototype.getSignedId = function () {
		if (this.getSignedIdPromise !== undefined) {
			return this.getSignedIdPromise;
		}

		var promise = new Promise;
		this.getSignedIdPromise = promise;

		this.getId().
			then(function (id) {
				promise.resolve(hmac.signMessage(id));
			},function (error) {
				promise.reject(error);
			});

		return promise;
	};

	Session.idLength = 128;

	Session.getNewId = function () {

		if (this.getNewIdPromise !== undefined) {
			return this.getNewIdPromise;
		}

		var promise = new Promise;
		this.getNewIdPromise = promise;

		if (this.id === undefined) {
			crypto.randomBytes(this.idLength,function (exception,buffer) {
				if (exception !== null) {
					promise.reject(exception);
				} else {
					promise.resolve(buffer.toString("base64"));
				}
			});
		} else {
			promise.resolve(this.id);
		}

		return promise;
	};

	var hmac = require("./hmac.js")(secretKey);

	return Session;
};
