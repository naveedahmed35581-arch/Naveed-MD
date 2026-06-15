const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Naveed MD Running');
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Server Started');
});
