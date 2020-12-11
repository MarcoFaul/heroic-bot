require('dotenv').config();
const {Client, Collection} = require('discord.js');
const client = new Client({
    disableEveryone: true
});


const prefix = "!";
client.commands = new Collection();
client.aliases = new Collection();

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});


client.on('ready', () => {
    console.log('I am ready!');
    console.log(`Logged in as ${client.user.tag}!`);
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
