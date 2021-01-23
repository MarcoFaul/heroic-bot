const {Client, MessageCollector} = require('discord.js');
const {readdirSync} = require("fs");

module.exports = {
    name: "reminder",
    aliases: ["eR"],
    description: "test",
    usage: "enableReminder",
    run: async (client, message, args) => {
        let channelName = '';

        message.author.send("Please provide the channel ID where all messages will posted to!");

        const filter = m => m.author.id === message.author.id;

        channelID = await getResponse(client, message, filter);
        console.log(channelID);
        // await client.channels.fetch(channelID).then(channel => {
        await client.channels.fetch('790966806633775115').then(channel => {
            channelName = channel.name;
        });

        console.log(channelName);

        message.author.send("Please enter your announcement text");
        announcementText = await getResponse(client, message, filter);
        console.log(announcementText);

        message.author.send(`The reminder ist set with the following data:
                channel=${channelName}
                announcement text=${announcementText}
            `);


        // we need to find the server again
        const channel = client.channels.cache.find(channel => channel.id === channelID)
        channel.send('hello world')
    }
}

async function getResponse(client, message, filter) {
    await message.channel.awaitMessages(filter, {
        max: 1,
        time: 15000,
        errors: ['time'],
    })
        .then((collected) => {
            console.log(collected.first().content);
            return collected.first().content;
        })
        .catch(() => {
            message.channel.send('Cancelled - Too Slow!').then(r => r.delete(5000));
        });
}

async function sendMessageToChannel(client, channelID, message) {
    client.channels.fetch(channelID).then(channel => {
        channel.send(message)
    });
}
