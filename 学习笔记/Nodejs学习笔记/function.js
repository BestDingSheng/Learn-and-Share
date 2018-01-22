//  同样的功能 不同的实现方式

// 匿名函数 
var http  = require("http");
http.creatServer(function(req,res){
	res.writeHead(200,{"Content-Type":"text/plain"});
	res.write("hello world");
	res.end()
}).listen(8888)

//  先定义后传递 

function onrequrst(res,req){
	res.writeHead(200,{"Content-Type":"text/plain"});
	res.write("hello world");
	res.end()
}
http.creatServer(onrequrst).listen(8888);