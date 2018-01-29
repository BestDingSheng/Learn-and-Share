const http = require('http');

const server = http.createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.url === '/') {
    res.statusCode = 200;
    res.end('/ request OK');
  } else {
    setTimeout(function() {
      res.statusCode = 500;
      res.end('other request error');
    }, 2000);
  }
});

server.listen('9999', function() {
  console.log('simple server is running in port 9999');
});