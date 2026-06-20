const fs = require("fs");
const path = require("path");

module.exports = () => {
  const commands = {};

  const files = fs.readdirSync(
    path.join(__dirname, "../commands")
  ).filter(file => file.endsWith(".js"));

  for (const file of files) {
    const command = require(
      path.join(__dirname, "../commands", file)
    );

    if (command.name) {
      commands[command.name] = command;
    }
  }

  return commands;
};
