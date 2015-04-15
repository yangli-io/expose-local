var http = require('http');

http.createServer(function(req, res){
	var ip = req.headers['x-forwarded-for'] + "||" + req.connection.remoteAddress + "||" + req.socket.remoteAddress + "||" + req.connection.socket.remoteAddress;
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.write(ip);
	res.end();
}).listen(process.env.PORT || 9000)