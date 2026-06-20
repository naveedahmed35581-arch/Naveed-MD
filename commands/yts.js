const yts = require("yt-search");

module.exports = {
  name: "yts",
  description: "YouTube Search",

  async execute(sock, msg, text) {

    const query = text.split(" ").slice(1).join(" ");

    if (!query) {
      return "❌ Example: .yts sidhu moose wala";
    }

    const search = await yts(query);

    if (!search.videos.length) {
      return "❌ No results found";
    }

    const v = search.videos[0];

    return `
🎬 *${v.title}*

👤 Channel: ${v.author.name}
⏱ Duration: ${v.timestamp}
👁 Views: ${v.views}

🔗 ${v.url}
`;
  }
};
