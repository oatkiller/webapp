var onAssertion;
var handleOnAssertion = function (assertionText) {
	console.log("passed: " + assertionText);
	assertEquals.passedCount++;
	if (typeof onAssertion === "function") {
		onAssertion();
	}
};
var assertEquals = function (actual,expected,assertionText) {
	if (actual !== expected) {
		console.log("FAILED ASSERTION: " + assertionText);
	} else {
		handleOnAssertion(assertionText);
	}
};
assertEquals.printPassedCount = function () {
	console.log("Passed " + this.passedCount + " assertions!");
};
assertEquals.passedCount = 0;
var assertRejected = function (promise,assertionText) {
	promise.then(function () {
		console.log("FAILED ASSERTION: " + assertionText);
	},function () {
		handleOnAssertion(assertionText);
	});
};
var assertResolved = function (promise,assertionText) {
	promise.then(function () {
		handleOnAssertion(assertionText);
	},function () {
		console.log("FAILED ASSERTION: " + assertionText);
	});
};
var fail = function (assertionText) {
	console.log("FAILED ASSERTION: " + assertionText);
};
var tests = [];
var addTests = function () {
	tests.push.apply(tests,Array.prototype.slice.call(arguments,0));
};
var start = function () {
	if (tests.length === 0) {
		assertEquals.printPassedCount();
	} else {
		var test = tests.splice(0,1)[0];
		onAssertion = function () {
			start();
		};
		test();
	}
};

module.exports = {
	assertEquals : assertEquals,
	assertResolved : assertResolved,
	assertRejected : assertRejected,
	fail : fail,
	addTests : addTests,
	start : start
};
