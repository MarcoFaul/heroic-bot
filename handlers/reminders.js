const { readdirSync } = require("fs");

module.exports = (client) => {
    const guildReminders = readdirSync("./assets/reminders/guild").filter(file => file.endsWith(".json"));
    for (let guildFile of guildReminders) {
        let guildReminderJson = require(`../assets/reminders/guild/${guildFile}`);
        client.guildReminders.set(guildReminderJson.channel, guildReminderJson);
    }

    const soloReminders = readdirSync("./assets/reminders/solo").filter(file => file.endsWith(".json"));
    for (let soloFile of soloReminders) {
        let soloReminderJson = require(`../assets/reminders/solo/${soloFile}`);
        client.soloReminders.set(soloReminderJson.channel, soloReminderJson);
    }
}

