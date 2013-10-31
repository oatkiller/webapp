var fileSystem = require("fs");
var test = require("./base_test.js");
fileSystem.readdir("tests",function (error,files) {
	var file;
	var filePattern = /.*\.js$/i;
	for (var i = 0, length = files.length; i < length; i++) {
		file = files[i];
		if (filePattern.test(file) === true) {
			require("./tests/" + file);
		}
	}
	test.start();
});
