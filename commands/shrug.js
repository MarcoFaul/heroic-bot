module.exports = {
    name: "shrug",
    aliases: ["shrug"],
    description: "¯\\_(ツ)_/¯",
    usage: "shrug",
    run: async (client, message, args) => {
        message.delete()
        message.channel.send(`${message.author.username}: ¯\\_(ツ)_/¯`);
    }
}
