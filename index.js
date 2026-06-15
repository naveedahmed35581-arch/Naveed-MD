const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
const http = require("http");

console.log("Naveed MD Starting...");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection } = update;

        if (connection === "open") {
            console.log("✅ WhatsApp Connected!");
        }

        if (connection === "close") {
            console.log("❌ Disconnected, restarting...");
            startBot();
        }
    });
}

startBot();

http.createServer((req, res) => {
    res.end("Naveed MD Bot Running");
}).listen(process.env.PORT || 3000);

console.log("Server Running OK");
