const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");
const presence = document.getElementById("presence-indicator");

const HOST = "ws://localhost:";
const PORT = "8080";
const allChat = [];

async function postNewMsg(user, text) {}

// listen for events on the form
chat.addEventListener("submit", (e) => {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

// tells server what method of communication we intend to use
const protocols = ["json"];
// websocket is built in to the browser and takes a url and protocol(s)
const ws = new WebSocket(`${HOST}${PORT}`, protocols);
/**
 * define callback used by the ws.onopen method (when the server upgrades connection
 * successfully/the handshake is complete)
 */
ws.addEventListener("open", () => {
  console.log("connected");
  presence.innerText = "🥔💬";
});

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

function render() {
  const html = allChat.map(({ user, text }) => template(user, text));
  msgs.innerHTML = html.join("\n");
}
