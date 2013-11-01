var client = new Faye.Client(fayeServerAddress);

var subscription = client.subscribe("/foo",function (message) {
	console.log(message);
});

client.publish("/foo",{
	text : "Hi there"
});

alert("yolo");
