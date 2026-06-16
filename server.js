const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

const app = express();
app.use(express.json());

let sock;

async function startSock() {
const { state, saveCreds } = await useMultiFileAuthState("./session");

sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" })
});

sock.ev.on("creds.update", saveCreds);

}

startSock();

app.get("/", (req, res) => {
res.sendFile(__dirname + "/index.html");
});

app.post("/pair", async (req, res) => {
try {
const number = req.body.number;

    if (!number) {
        return res.json({ error: "Number required" });
    }

    const code = await sock.requestPairingCode(number);

    res.json({
        success: true,
        code: code
    });

} catch (e) {
    res.json({ error: e.message });
}

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log("🚀 Naveed MD Pair Web Running on " + PORT);
});
