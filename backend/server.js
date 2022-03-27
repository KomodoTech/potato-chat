import http from 'http';
import handler from 'serve-handler';
import NanoBuffer from 'nanobuffer';
// helpers to deal with binary streams of data used in websockets
import objToResponse from './obj-to-response.js';
import genSecWSAccept from './gen-sec-ws-accept.js';
// import parseMessage from './parse-message.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 8080;

let connections = [];
// pass in max size of buffer in bytes
const message = new NanoBuffer(50);
const getMessages = () => {
  /**
   * upon instantiation, NanoBuffer creates an object with a property
   * _buffer which will initially be full of n empty items (where n is the max size passed in)
   * NanoBuffer.push pushes the item to the _buffer
   * so below we are removing all empty items and then reverses the order of the array
   * TODO: look into if we want to do this and why
   */
  return Array.from(message).reverse();
}

for (let i = 0; i < 7/2; i++) {
  message.push({
    user: `janson${i}`,
    text: 'janson is having a great time',
    time: Date.now(),
  });
}

console.log('message._buffer', message._buffer);
console.log(getMessages());

// serve static assets
const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: "./frontend",
  });
});

/**
 *  When an upgrade request is made, then we want to do the websocket handshake
 *  if applicable
 */
server.on('upgrade', (req, socket) => {
  // we're not dealing with non socket upgrade requests
  if (req.headers['upgrade'] !== 'websocket') {
    socket.end("HTTP/1.1 400 BAD REQUEST")
    return;
  }

  // NOTE: there's nothing secure going on. just passing back special strings
  // to make sure everyone agrees we're going to be working with websockets
  const clientKey = req.headers['sec-websocket-key'];
  const acceptKey = genSecWSAccept(clientKey);
  // console.log('acceptKey:', acceptKey);
  /**
   * array of http headers that we want to send to browser
   * to complete the websocket handshake
   */
  const headers = [
    "HTTP/1.1 101 Web Socket Protocol Handshake",
    "Upgrade: WebSocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${acceptKey}`,
    "Sec-WebSocket-Protocol: json",
    "\r\n",
  ];

  /**
   * Join all header strings together and end with two returns (\r\n\r\n)
   * which is how the http protocol knows that you're done
   */
  socket.write(headers.join("\r\n"));

  socket.write(objToResponse({ message: getMessages() }));
  
  // honor upgrade request
  console.log('🧦');
})

server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
