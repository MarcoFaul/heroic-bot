var cron = require('node-cron');
const config = require("./../config.json");
const messageHelper = require("./../helper/message");
let spiderEventMessage = 'The next guild attack is in';

const getText = (num) => {
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);

    return `${spiderEventMessage} ${rhours}h and ${rminutes}m ...`;
}

module.exports = async (client) => {


    var message = undefined;

    cron.schedule('* * * * *', () => {
        var guildEventStartDate = new Date(config.guildSpiderEventStart);
        var currentDate = new Date();

        client.guildAttackReminders.forEach((nextGuildAttack, key, map) => {
            let nearestEvent = undefined;
            let reminderChannel = undefined;

            nextGuildAttack.forEach(nextAttack => {
                tempStart = guildEventStartDate;
                tempCurrentDate = currentDate;
                tempStart.setMinutes(tempStart.getMinutes() + nextAttack.start);

                // get the different in minutes
                let difference = tempCurrentDate.getTime() - tempStart.getTime();
                let resultInMinutes = Math.round(difference / 60000);

                if (nearestEvent === undefined) {
                    nearestEvent = resultInMinutes;
                    reminderChannel = key
                }

                if (nearestEvent < resultInMinutes) {
                    nearestEvent = resultInMinutes
                }
            })

            let text = getText(Math.abs(nearestEvent));

            if (message !== undefined) {
                message.then(msg => {
                    msg.edit(text)
                })
            } else {
                message = messageHelper.sendMessageToChannel(client, reminderChannel, text)
                message.then(msg => {
                    msg.pin();
                })
            }

        })
    });
}
