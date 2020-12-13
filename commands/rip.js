const Discord = require('discord.js');

module.exports = {
    name: "rip",
    aliases: ["rip"],
    description: "Posts a rip image",
    usage: "rip",
    run: async (client, message, args) => {
        const attachment = new Discord.MessageAttachment('https://i.imgur.com/w3duR07.png');
        message.channel.send(`${message.author},`, attachment);
    }
}
