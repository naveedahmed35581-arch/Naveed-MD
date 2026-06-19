const yts = require("yt-search");

module.exports = {
  name: "play",
  description: "Search Song",

  async execute(args) {
    if (!args.length) {
      return "❌ Example: .play Atif Aslam";
    }

    const query = args.join(" ");

    const result = await yts(query);

    if (!result.videos.length) {
      return "❌ Song not found";
    }

    const video = result.videos[0];

    return `
🎵 *${video.title}*

⏱ Duration: ${video.timestamp}
👀 Views: ${video.views}

🔗 ${video.url}
`;
  }
};
