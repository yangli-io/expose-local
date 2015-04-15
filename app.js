var http = require('http');
var fs = require('fs');

var log = fs.readFileSync('./log.txt');

http.createServer(function(req, res){
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	console.log(ip);
	log += ip + "\n";
	fs.writeFileSync('./log.txt', log);
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.write("yolo");
	res.end();
}).listen(9000)