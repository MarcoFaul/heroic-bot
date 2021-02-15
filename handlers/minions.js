const {readdirSync} = require("fs");

module.exports = (client) => {
    const minionFiles = readdirSync(__dirname + "/../assets/heroic/minions/").filter(file => file.endsWith(".js"));
    for (const minionFile of minionFiles) {
        let minion = require(__dirname + `/../assets/heroic/minions/${minionFile}`);
        client.minions.set(minion.position, minion)
    }

// sort
    client.minions.sort((a, b) => {
        return a.position - b.position;
    });

};
