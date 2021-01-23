const sendMessageToChannel = async (client, channelID, message) => {
    client.channels.cache.get(channelID).send(message);
}

module.exports = {
    sendMessageToChannel
};
