var https = require("https");
var fileSystem = require("fs");
var faye = require("faye");

fileSystem.readFile("secret_key",{
	"encoding" : "utf8"
},function (error,secretKey) {

	if (error !== null) {
		throw error;
	}

	var Session = require("./session.js")(secretKey);

	fileSystem.readFile("index_template.html",{
		"encoding" : "utf8"
	},function (error,data) {

		if (error !== null) {
			throw error;
		}

		var fayeServerAddress = "/socket";
		var fayeClientAddress = fayeServerAddress + "/client.js";

		var responseTemplateParts = data.split(/#\{signedSessionId}/);

		var firstPartOfResponse = responseTemplateParts[0].
			replace(/#\{fayeServerAddress}/,fayeServerAddress).
			replace(/#\{fayeClientAddress}/,fayeClientAddress);

		var secondPartOfResponse = responseTemplateParts[1];

		var responseLength = new Buffer(data).length + Session.signedIdLength;

		var options = {
			key: fileSystem.readFileSync("server.key"),
			cert: fileSystem.readFileSync("server.crt")
		};

		var bayeux = new faye.NodeAdapter({
			mount : fayeServerAddress
		});

		var getNewSignedSessionId = function () {
			var session = new Session;
			var signedSessionId = session.getSignedId();
			//preserveSession(session);
			return signedSessionId;
		};

		var server = https.createServer(options,function (request,response) {

			response.writeHead(200,{
			 "Content-Length": responseLength,
			});

			response.write(firstPartOfResponse);

			getNewSignedSessionId().
				then(function (signedSessionId) {

					response.write(signedSessionId + secondPartOfResponse);
					console.log("ENDING RESPONSE");
					response.end();

				},function (error) {
					throw new Error("Couldnt generate session id: " + error);
				});
		});

		bayeux.attach(server);

		server.listen(8000);

	});

});
