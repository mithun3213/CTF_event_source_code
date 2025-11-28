const { app, accounts } = require('./http');
const { xssbot } = require('./visitor');
const { getWebsocketServer } = require('./ws');

const server = require('http').createServer();

const port = parseInt(process.env?.PORT || "3000");
const wss = getWebsocketServer(server, accounts, xssbot);

server.on('request', app);

server.listen(port, "0.0.0.0", () => {
  console.log(`App listening on port ${port}`)
});
