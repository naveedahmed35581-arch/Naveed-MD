const http = require('http');
const fs = require('fs');

console.log("Naveed MD Loading...");

http.createServer((req, res) => {
res.end("Naveed MD Online ✅");
}).listen(process.env.PORT || 3000);

const commands = fs.readdirSync('./commands');
console.log("Commands Loaded:", commands.length);

console.log("Running OK");
