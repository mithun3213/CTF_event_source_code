const { WebSocketServer } = require('ws');

function getWebsocketServer(server, accounts, xssbot) {
  const wss = new WebSocketServer({ server: server });
  
  function setUsername(ws, username, anonymous) {
    if (anonymous &&
        (
          getUsers().includes(username) ||
          !/^kitten_[0-9]+$/.test(username))
        ) {
      ws.username = `invalid_${Math.random().toString(16).substring(2)}`;
      return false;
    }
    ws.username = username;
    return true;
  }
  
  function getUsers() {
    return [...wss.clients].map(e=>e?.username).filter(e=>e);
  }
  
  function updateUsers() {
    const message = JSON.stringify({type:"USERS", users:getUsers()});
    wss.clients.forEach(e=>e.send(message));
  }
  
  function chatBroadcast(text) {
    const message = JSON.stringify({type:"MESSAGE", text});
    wss.clients.forEach(e=>e.send(message));
  }
  
  wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
  
    ws.on('message', function message(message) {
      try {
        const data = JSON.parse(message);
        switch (data.type) {
          case "LOGIN":
            if (accounts[data.username]?.userkey == data.key) {
              ws.verified = true;
              setUsername(ws, data.username, false);
            }
            break;
          case "START":
            if (!ws?.verified)
              setUsername(ws, data.username, true);
            ws.send(JSON.stringify({type:"CHANNEL", channel:"general"}));
            updateUsers();
            break;
          case "MESSAGE":
            if (ws.username)
              chatBroadcast(`<${ws.username}> ${data.text}`);
            if (data.text.includes("!admin"))
              xssbot();
            break;
        }
      } catch (e) {
        console.error(e);
      }
    });
  });

  return wss;
}

module.exports = { getWebsocketServer };