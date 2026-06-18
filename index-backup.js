const { loadPlugins } = require("./plugins");

const plugins = loadPlugins();

console.log(`✅ ${plugins.length} Plugins Loaded`);
const fs = require("fs");
const path = require("path");

console.log("🚀 Naveed MD Starting...");

const commands = {};

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
const command = require(path.join(__dirname, "commands", file));
commands[command.name] = command;
}

console.log(`✅ ${Object.keys(commands).length} Commands Loaded`);
console.log("🔥 Naveed MD Loaded");

console.log("Available Commands:");
console.log(Object.keys(commands).join(", "));
