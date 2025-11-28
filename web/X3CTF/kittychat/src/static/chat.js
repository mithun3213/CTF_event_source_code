socket = null;
currentChannel = null;
user = {};
username = `kitten_${Math.random().toString().substring(2,6)}`;

function connectionLost() {
  addChatMessage(`=== connection lost at ${new Date().toTimeString()} ===`);
}

function initSocket() {
  socket = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}`);
  socket.onopen = function() {
    if (user?.userkey)
      socket.send(JSON.stringify({type: 'LOGIN', username, key: user?.userkey}));
    socket.send(JSON.stringify({type: 'START', username}));
  };
  socket.onclose = connectionLost;
  socket.onerror = connectionLost;
  socket.onmessage = function(message) {
    const data = JSON.parse(message.data);
    switch (data.type) {
      case "CHANNEL":
        switchChannel(data.channel);
        break;
      case "USERS":
        updateUsers(data.users);
        break;
      case "MESSAGE":
        addChatMessage(data.text);
        break;
    }
  };
}

function updateUsers(usersList) {
  const documentFragment = document.createRange().createContextualFragment(["Currently online:", ...usersList].map(e=>`<div>${e}</div>`).join(''));
  const usersListEl = document.querySelector("chat-side");
  usersListEl.innerText = '';
  usersListEl.append(documentFragment);
}

function addChatMessage(msg) {
  const msgEl = document.createElement("div");
  msgEl.innerText = msg;
  if (msg.startsWith("===")) msgEl.style.color = "#888";
  if (msg.startsWith("<admin>")) msgEl.style.color = "#800";
  if (msg.startsWith(`<${username}>`)) msgEl.style.color = "#008";
  if (msg.substring(2).includes(`${username}`)) {
    msgEl.innerHTML = msgEl.innerHTML.substring(0,6) + msgEl.innerHTML.substring(6).replaceAll(username, `<span style="color:#FFF;background:#F00;padding: 0 2px">${username}</span>`);
  }
  const chatLog = document.querySelector("chat-log");
  chatLog.appendChild(msgEl);
  chatLog.scroll({top: 0xFFFFFF, behavior: "smooth"});
}

function sendChatMessage() {
  const inputbox = document.querySelector("chat-input input");
  const msg = inputbox.value;
  if (!msg.length) return;
  inputbox.value = "";
  socket.send(JSON.stringify({type: 'MESSAGE', text: msg}));
}

function switchChannel(channel) {
  currentChannel = `#${channel}`;
  document.querySelector("chat-username span").innerText = username;
  document.querySelector("chat-name").innerText = currentChannel;
  addChatMessage(`=== joined ${currentChannel} at ${new Date().toTimeString()} ===`);
}

async function loadUser() {
  user = await (await fetch("/user")).json();
  if (user?.username) {
    username = user?.username;
    document.querySelector("chat-username a").innerText = "account";
  }
  initSocket();
}

loadUser();
document.querySelector("chat-input button").onclick = sendChatMessage;
document.querySelector("chat-input input").onkeydown = e => e.keyCode == 13 && sendChatMessage() || 1;
