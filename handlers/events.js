module.exports = async (sock, msg) => {
  try {
    if (!msg.message) return;

    const from = msg.key.remoteJid;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    console.log(
      `[MESSAGE] ${from} : ${text}`
    );

  } catch (err) {
    console.log("Event Error:", err);
  }
};
