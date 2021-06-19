var express = require("express");
var app = express();
require('dotenv').config();
const {Client, Collection} = require('discord.js');
const client = new Client({
    disableEveryone: true
});

// init collections
client.config = require("./config.json");
client.commands = new Collection();
client.heroes = new Collection();
client.minions = new Collection();
client.aliases = new Collection();
client.guildReminders = new Collection();
client.guildAttackReminders = new Collection();
client.soloReminders = new Collection();

// fill collections
["command", "reminders", "heroes", "minions"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

// auto start features
["spiderEventReminder", "spiderEventCountdown"].forEach(event => {
    require(`./features/${event}`)(client);
});


client.on('ready', () => {
    console.log('I am ready!');
    console.log(`Prefix: ${client.config.prefix}`);
});

client.on('message', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(client.config.prefix)) return;
    const commandBody = message.content.slice(client.config.prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    // find command by "command" or "alias"
    let cmd = client.commands.get(command);
    if (!cmd) cmd = client.commands.get(client.aliases.get(command));

    if (cmd) {
        cmd.run(client, message, args);
    }
});

client.login(process.env.BOT_TOKEN);

app.listen(process.env.PORT || 80, () => {
    console.log("Server running on port " + process.env.PORT || 80);
});

app.get("/", (req, res, next) => {
    res.json(["Heroic Bot"]);
});

app.get("/health", (req, res, next) => {
    res.json(["Success"]);
});
