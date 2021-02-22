const sendMessageToChannel = async (client, channelID, message) => {
    return await client.channels.cache.get(channelID).send(message);
}

const fetchChannelMessage = async (client, channelID, messageId) => {
    return await client.channels.cache.get(channelID).messages.fetch(messageId);
}

module.exports = {
    sendMessageToChannel,
    fetchChannelMessage
};
