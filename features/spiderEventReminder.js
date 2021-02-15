const {writeFileSync} = require("fs");
const path = require("path");
var cron = require('node-cron');
const messageHelper = require("./../helper/message");

const soloEventEndInMinutes = 6240;
const nextSpiderEvent = 14;

module.exports = (client) => {
    cron.schedule('* * * * *', () => {
        var currentDate = new Date();
        let config = client.config;
        let soloEventStartDate = new Date(config.soloSpiderEventStart);

        processReminders(client, client.guildReminders, config.guildSpiderEventStart, currentDate);
        processReminders(client, client.soloReminders, config.soloSpiderEventStart, currentDate);

        soloEventStartDate.setMinutes(soloEventStartDate.getMinutes() + soloEventEndInMinutes);
        if (soloEventStartDate < currentDate) {
            resetReminder(client)
        }
    });
}


function processReminders(client, reminders, eventStart, currentDate) {

    reminders.forEach(reminderData => {
        reminderData.events.forEach(guildReminder => {
            var guildEventStartDate = new Date(eventStart);


            if (guildReminder.prev) {
                guildEventStartDate.setMinutes(guildEventStartDate.getMinutes() - guildReminder.start);
            } else {
                guildEventStartDate.setMinutes(guildEventStartDate.getMinutes() + guildReminder.start);
            }

            // get the different in minutes
            let difference = currentDate.getTime() - guildEventStartDate.getTime();
            let resultInMinutes = Math.round(difference / 60000);
            // send message if we have the same minute
            if (resultInMinutes === 0) {
                messageHelper.sendMessageToChannel(client, reminderData.channel, guildReminder.text)
            }
        })
    });
}

function resetReminder(client) {
    let config = client.config;
    var soloEventStartDate = new Date(config.soloSpiderEventStart);
    var guildEventStartDate = new Date(config.guildSpiderEventStart);
    soloEventStartDate.setDate(soloEventStartDate.getDate() + nextSpiderEvent);
    guildEventStartDate.setDate(guildEventStartDate.getDate() + nextSpiderEvent);

    var soloEventNextStart = soloEventStartDate.getFullYear() + "-" + ("0" + (soloEventStartDate.getMonth() + 1)).slice(-2) + "-" + ("0" + soloEventStartDate.getDate()).slice(-2) + " " + soloEventStartDate.getHours() + ":" + ("0" + soloEventStartDate.getMinutes()).slice(-2);
    var guildEventNextStart = guildEventStartDate.getFullYear() + "-" + ("0" + (guildEventStartDate.getMonth() + 1)).slice(-2) + "-" + ("0" + guildEventStartDate.getDate()).slice(-2) + " " + guildEventStartDate.getHours() + ":" + ("0" + guildEventStartDate.getMinutes()).slice(-2);

    config.soloSpiderEventStart = soloEventNextStart;
    config.guildSpiderEventStart = guildEventNextStart;

    writeFileSync(path.join(__dirname, '/../config.json'), JSON.stringify(config));
    client.config = config;
}
