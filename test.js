var Session = require("./session.js")("secretYolo");
var session = new Session;
var session2;
session.
	getSignedId().
	then(function (signedId) {
		session2 = new Session(signedId);
	});

session.
	getId().
	then(function (session1Id) {
		session2.
			getId().
			then(function (session2Id) {
				console.log(session1Id," equals ",session2Id);
				console.log(session1Id === session2Id);
			});
	});
