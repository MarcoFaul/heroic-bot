var cron = require('node-cron');
const messageHelper = require("./../helper/message");
let spiderEventMessage = 'Next guild attack is in';

const getText = (num) => {

    if (num === 99999999) {
        return 'Next guild attack time will be announced soon!'
    }

    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);

    if ((rhours === 0 && rminutes === 0) || rhours === -0 && rminutes === -0) {
        return 'Attack now!';
    }

    return `${spiderEventMessage} ${rhours}h and ${rminutes}m...`;
}

module.exports = async (client) => {

    var message = undefined;

    cron.schedule('* * * * *', () => {
        client.guildAttackReminders.forEach((nextGuildAttack, key) => {
            let nearestEvent = -99999999;
            let reminderChannel = undefined;

            nextGuildAttack.forEach(nextAttack => {
                tempStart = new Date(client.config.guildSpiderEventStart);
                tempCurrentDate = new Date();
                tempStart.setMinutes(tempStart.getMinutes() + nextAttack.start);

                // get the different in minutes
                let difference = tempCurrentDate.getTime() - tempStart.getTime();
                let resultInMinutes = Math.round(difference / 60000);

                //@TODO: this does not work with multiple server guild attacks
                reminderChannel = key

                // we want to get the lowest negative number for the next attack
                if (Math.sign(resultInMinutes) !== -1) {
                    return;
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
                    msg.react("🔥")
                    msg.react("🕷️")
                    // msg.react("⚔️️️") //@TODO: this does not work yet
                    msg.pin();
                }).catch()
            }
        })
    });
}
