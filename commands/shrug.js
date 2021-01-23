module.exports = {
    name: "shrug",
    aliases: ["shrug"],
    description: "¯\\_(ツ)_/¯",
    usage: "shrug",
    run: async (client, message, args) => {
        message.channel.send(`¯\\_(ツ)_/¯`);
    }
}
