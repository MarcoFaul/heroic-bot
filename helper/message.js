const sendMessageToChannel = async (client, channelID, message) => {
    return await client.channels.cache.get(channelID).send(message);
}

module.exports = {
    sendMessageToChannel
};
