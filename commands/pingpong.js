module.exports = {
    name: "ping",
    aliases: ["ping"],
    description: "Responses with pong",
    usage: "ping",
    run: async (client, message, args) => {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`🏓 Pong! This message had a latency of ${timeTaken}ms.`);
    }
}
