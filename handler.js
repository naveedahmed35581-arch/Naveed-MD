module.exports = async (sock, m) => {
try {

    const msg = m.messages[0];
    if (!msg.message) return;

    const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text || "";

    const prefix = ".";

    if (text === prefix + "ping") {
        await sock.sendMessage(msg.key.remoteJid, {
            text: "Pong 🏓"
        });
    }

    if (text === prefix + "alive") {
        await sock.sendMessage(msg.key.remoteJid, {
            text: "Naveed MD is Alive ✅"
        });
    }

    if (text === prefix + "menu") {
        await sock.sendMessage(msg.key.remoteJid, {
            image: {
                url: "https://bandaheali-cdn.koyeb.app/media/bot_1781626177072.jpeg"
            },
            caption: `

╔════════════════════╗
║ 🤖 NAVEED MD
╚════════════════════╝

👑 OWNER
• .owner
• .support

⚡ BOT
• .ping
• .alive
• .info
• .menu

📢 CHANNEL
https://whatsapp.com/channel/0029Vawbj7e5kg7AFF5MuZ28

👑 OWNER
923213231887

🌍 MODE : PUBLIC
⚡ VERSION : 1.0.0
`
});
}

    if (text === prefix + "info") {
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🤖 Bot: Naveed MD\n👑 Owner: Naveed\n⚡ Status: Online`
        });
    }

} catch (e) {
    console.log("Handler Error:", e);
}

};
