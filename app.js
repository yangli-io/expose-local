var http = require('http');

http.createServer(function(req, res){
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.write(getIP(req));
	res.end();
}).listen(process.env.PORT || 9000)


function getIP(req){
	var ip = {
		
		connection: {
			remoteAddress: req.connection && req.connection.remoteAddress,
			socket: {
				remoteAddress: req.connection && req.connection.socket && req.connection.socket.remoteAddress
			}
		},
		socket: {
			remoteAddress: req.socket && req.socket.remoteAddress
		}
	}
	ip['x-forwarded-for'] = req.headers && req.headers['x-forwarded-for'];
	return JSON.stringify(ip, true);
}