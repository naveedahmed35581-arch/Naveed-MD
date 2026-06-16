const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const http = require("http");

console.log("Naveed MD Starting...");

async function startBot() {
const { state, saveCreds } = await useMultiFileAuthState("./session");

const sock = makeWASocket({
    auth: state,
    browser: ["Naveed MD", "Chrome", "1.0.0"]
});

sock.ev.on("creds.update", saveCreds);

sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {

    if (connection === "open") {
        console.log("✅ WhatsApp Connected!");
    }

    if (connection === "close") {
        console.log("❌ Connection Closed");

        const shouldReconnect =
            lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
            startBot();
        }
    }
});

}

startBot();

http.createServer((req, res) => {
res.end("Naveed MD Running");
}).listen(process.env.PORT || 3000);

console.log("Server Running OK");const handler = require("./handler");sock.ev.on("messages.upsert", async (m) => {
    await handler(sock, m);
});
