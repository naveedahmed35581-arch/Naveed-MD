
console.log("Naveed MD Bot Running OK");

const http = require('http');

http.createServer((req, res) => {
  res.end("Server OK");
}).listen(process.env.PORT || 3000);
