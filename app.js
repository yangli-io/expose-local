var http = require('http');
var qs = require('querystring');

var queue = {}
var count = 0;

http.createServer(function(req, res){
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	if (req.url != '/get' && req.url != '/post'){
		queue[count] = {
			count: count,
			url: req.url,
			data: ""
		}
		queue[count].watch('data', function(id, oldVal, newVal){
			res.write(newVal);
			res.end();
			this.unwatch('data');
		})
		count++;
	} else if (req.url === '/get'){
		res.write(JSON.stringify(queue, true));
		res.end();
	} else if (req.url === '/post'){
		if (req.method === 'POST'){
			var body = "";
			req.on('data', function(data){
				body += data;
				if (body.length > 1000000){
					req.connection.destroy();
				}
			})
			req.on('end', function(){
				var post = qs.parse(body);
				queue[post.count].data = post.data;
				res.write('done');
				res.end();
			})
		}
	}

}).listen(process.env.PORT || 9000)

setInterval(function(){
	for (key in queue){
		if (queue[key].data){
			delete queue[key];
		}
	}
},10000)


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



if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop, handler) {
			var
			  oldval = this[prop]
			, newval = oldval
			, getter = function () {
				return newval;
			}
			, setter = function (val) {
				oldval = newval;
				return newval = handler.call(this, prop, oldval, val);
			}
			;
			
			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					  get: getter
					, set: setter
					, enumerable: true
					, configurable: true
				});
			}
		}
	});
}
 
// object.unwatch
if (!Object.prototype.unwatch) {
	Object.defineProperty(Object.prototype, "unwatch", {
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop) {
			var val = this[prop];
			delete this[prop]; // remove accessors
			this[prop] = val;
		}
	});
}