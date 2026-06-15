
const http = require('http');

http.createServer((req, res) => {
  res.end("Naveed MD Stable Server");
}).listen(process.env.PORT || 3000);

console.log("Running OK");
console.log("Naveed MD Loading...");
