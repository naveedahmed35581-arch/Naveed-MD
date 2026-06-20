const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const path = require("path");

console.log("🚀 Naveed MD Starting...");

const commands = {};

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, "commands", file));

  if (command.name) {
    commands[command.name] = command;
  }
}

console.log(`✅ ${Object.keys(commands).length} Commands Loaded`);

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("✅ WhatsApp Connected");
    }

    if (connection === "close") {
      console.log("❌ WhatsApp Disconnected");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];

    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    if (!text.startsWith(".")) return;

    const cmd = text.slice(1).split(" ")[0].toLowerCase();

    if (!commands[cmd]) return;

    try {
      const result = await commands[cmd].execute();

      await sock.sendMessage(
        msg.key.remoteJid,
        { text: String(result || "✅ Done") }
      );
    } catch (err) {
      console.log(err);
    }
  });
}

startBot();
