var test = require("../base_test.js");
var authentication = require("../authentication.js");
with (test) {
	addTests(
		function () {
			var user = new authentication.User;
			user.setUsername("robert");
			assertEquals(user.getUsername(),"robert","Username is persisted.");
		},
		function () {
			user = new authentication.User;
			user.setUsername("Robert");
			assertEquals(user.getUsername(),"robert","Username is case insensitive.");
		},
		function () {
			user = new authentication.User;
			assertRejected(user.setPassword("aaaaaaaaa"),"Passwords shorter than 10 characters may not be set.");
		},
		function () {
			user = new authentication.User;
			assertRejected(user.setPassword("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),"Passwords longer than 128 characters may not be set.");
		},
		function () {
			user = new authentication.User;
			assertRejected(user.setPassword("aaaaaaaaaaaaaaaaaaa"),"Passwords shorter than 20 characters that only consist of lower case latin characters may not be set.");
		},
		function () {
			user = new authentication.User;
			assertResolved(user.setPassword("Aa0 a a a a a"),"Passwords may contain spaces.");
		},
		function () {
			user = new authentication.User;
			var assertionText = "Passwords are case sensitive.";

			user.
				setPassword("0,AaAaAaAaAaAaAaAaAaA").
				then(function () {
					return user.getPasswordMatches("0,aaaaaaaaaaaaaaaaaaa");
				},function () {
					fail(assertionText);
				}).
				then(function (matches) {
					assertEquals(matches,false,"Passwords are case sensitive.");
				},function () {
					fail(assertionText);
				});

		},
		function () {
			user = new authentication.User;

			var assertionText = "Identical password matches";
			var password = "0,AaAaAaAaAaAaAaAaAaA";

			user.
				setPassword(password).
				then(function () {
					return user.getPasswordMatches(password);
				},function () {
					fail(assertionText);
				}).
				then(function (matches) {
					assertEquals(matches,true,assertionText);
				},function () {
					fail(assertionText);
				});

		}
	);
}
