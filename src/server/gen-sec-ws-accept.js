import crypto from "crypto";

const websocketMagicString = "258EAFA5-E914-47DA-95CA-C5AB0DC85B13";
/**
 * The Sec-WebSocket-Accept header is important in that
 * the server must derive it from the Sec-WebSocket-Key that the client sent to it.
 * To get it, concatenate the client's Sec-WebSocket-Key and the string
 * "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" together (it's a "magic string"),
 *  take the SHA-1 hash of the result, and return the base64 encoding of that hash.
 */
function genSecWSAccept(secWebSocketKey) {
  return crypto
    .createHash("sha1")
    .update(secWebSocketKey + websocketMagicString, "binary")
    .digest("base64");
}

export default genSecWSAccept;
