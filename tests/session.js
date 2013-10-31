var test = require("../base_test.js");
var SessionModule = require("../session.js");

with (test) {
	addTests(
		function () {
			var Session = SessionModule("secretYolo");
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
							assertEquals(session1Id,session2Id,"Unabled to generate, sign, recreate, and verify a session.");
						});
				});
		}
	);
}
