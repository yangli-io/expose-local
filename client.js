var http = require('http');
var request = require('request');

setInterval(poll, 1500);

var completed = {};

function poll(){
	var opt = {
		url: 'https://lit-headland-9373.herokuapp.com/get'
	};
	
	request(opt, function(error, response, body){
      var queue = JSON.parse(body);
      for (var key in queue){

      	if (!completed[key]){
      		//get data and post it
      		var options = {
			  url: 'http://lfiledev.service.nextgen.net' + queue[key].url,
			  headers: {
			    Authorization : 'Basic TGZpbGVEZXZTVEdMZW5kZXI6dmljYXJpb3VzODc3ZG9n', //For St George
			    'x-lfile-audit-accessing-user' : 'yang.li@nextgen.net',
			    'x-lfile-audit-accessing-location' : 'localhost'
			  }
			};

			getData(queue[key].count, options);
      	}
      }
    });

}

function getData(count, options){
	request(options, function(error, response, body){
      request({
		  uri: "https://lit-headland-9373.herokuapp.com/post",
		  method: "POST",
		  form: {
		  	count: count,
		    data: body
		  }
		}, function(error, response, body) {

		});
    });
}
