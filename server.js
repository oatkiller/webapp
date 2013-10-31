var https = require("https");
var fileSystem = require("fs");

var options = {
  key: fileSystem.readFileSync("server.key"),
  cert: fileSystem.readFileSync("server.crt")
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8000);
