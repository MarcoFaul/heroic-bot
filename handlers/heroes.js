const {readdirSync} = require("fs");

module.exports = (client) => {
    const heroFiles = readdirSync(__dirname + "/../assets/heroic/heroes/").filter(file => file.endsWith(".js"));
    for (const heroFile of heroFiles) {
        let hero = require(__dirname + `/../assets/heroic/heroes/${heroFile}`);
        client.heroes.set(hero.position, hero)
    }

// sort
    client.heroes.sort((a, b) => {
        return a.position - b.position;
    });

};
