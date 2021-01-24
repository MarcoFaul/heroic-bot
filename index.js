require('dotenv').config();
const {prefix} = require("./config.json");
const {Client, Collection} = require('discord.js');
const client = new Client({
    disableEveryone: true
});

// init collections
client.commands = new Collection();
client.aliases = new Collection();
client.guildReminders = new Collection();
client.guildAttackReminders = new Collection();
client.soloReminders = new Collection();

// fill collections
["command", "reminders"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

// auto start features
["spiderEventReminder", "spiderEventCountdown"].forEach(event => {
    require(`./features/${event}`)(client);
});


client.on('ready', () => {
    console.log('I am ready!');
    console.log(`Prefix: ${prefix}`);
});

client.on('message', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const commandBody = message.content.slice(prefix.length);
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
