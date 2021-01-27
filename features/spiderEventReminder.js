const {writeFileSync} = require("fs");
const path = require("path");
var cron = require('node-cron');
const config = require("./../config.json");
const messageHelper = require("./../helper/message");

const soloEventEndInMinutes = 6240;
const nextSpiderEvent = 14;

module.exports = (client) => {
    cron.schedule('* * * * *', () => {
        var soloEventStartDate = new Date(config.soloSpiderEventStart);
        var guildEventStartDate = new Date(config.guildSpiderEventStart);

        var currentDate = new Date();
        processReminders(client, client.guildReminders, guildEventStartDate, currentDate);
        processReminders(client, client.soloReminders, soloEventStartDate, currentDate);

        soloTempStartDate = soloEventStartDate;
        soloTempStartDate.setMinutes(soloTempStartDate.getMinutes() + soloEventEndInMinutes);
        if (soloTempStartDate < currentDate) {
            resetReminder()
        }
    });
}


function processReminders(client, reminders, startDate, currentDate) {

    reminders.forEach(reminderData => {
        reminderData.events.forEach(guildReminder => {
            let tempStart = startDate;


            if (guildReminder.prev) {
                tempStart.setMinutes(tempStart.getMinutes() - guildReminder.start);
            } else {
                tempStart.setMinutes(tempStart.getMinutes() + guildReminder.start);
            }

            // get the different in minutes
            let difference = currentDate.getTime() - tempStart.getTime();
            let resultInMinutes = Math.round(difference / 60000);

            // send message if we have the same minute
            if (resultInMinutes === 0) {
                messageHelper.sendMessageToChannel(client, reminderData.channel, guildReminder.text)
            }
        })
    });
}

function resetReminder() {
    var soloEventStartDate = new Date(config.soloSpiderEventStart);
    var guildEventStartDate = new Date(config.guildSpiderEventStart);

    soloEventStartDate.setDate(soloEventStartDate.getDate() + nextSpiderEvent);
    guildEventStartDate.setDate(guildEventStartDate.getDate() + nextSpiderEvent);

    var soloEventNextStart = soloEventStartDate.getFullYear() + "-" + ("0" + (soloEventStartDate.getMonth() + 1)).slice(-2) + "-" + ("0" + soloEventStartDate.getDay()).slice(-2) + " " + soloEventStartDate.getHours() + ":" + ("0" + soloEventStartDate.getMinutes()).slice(-2);
    var guildEventNextStart = guildEventStartDate.getFullYear() + "-" + ("0" + (guildEventStartDate.getMonth() + 1)).slice(-2) + "-" + ("0" + guildEventStartDate.getDay()).slice(-2) + " " + guildEventStartDate.getHours() + ":" + ("0" + guildEventStartDate.getMinutes()).slice(-2);

    config.soloSpiderEventStart = soloEventNextStart;
    config.guildSpiderEventStart = guildEventNextStart;

    writeFileSync(path.join(__dirname, '/../config.json'), JSON.stringify(config));
}
