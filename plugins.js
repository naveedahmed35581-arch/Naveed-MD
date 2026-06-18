const fs = require("fs");

function loadPlugins() {
  const plugins = [];

  if (!fs.existsSync("./plugins")) {
    return plugins;
  }

  const files = fs.readdirSync("./plugins");

  for (const file of files) {
    plugins.push(file);
  }

  return plugins;
}

module.exports = { loadPlugins };
