const Discord = require('discord.js');
const Canvas = require('canvas');
const {readdirSync} = require("fs");
const {getMapping} = require("./../assets/heroic/mapping/index");

const maxMinions = 12;
heroCollection = new Discord.Collection();
minionCollection = new Discord.Collection();

const heroes = readdirSync(__dirname + "/../assets/heroic/heroes/").filter(file => file.endsWith(".js"));
const minions = readdirSync(__dirname + "/../assets/heroic/minions/").filter(file => file.endsWith(".js"));

for (const heroFile of heroes) {
    let hero = require(__dirname + `/../assets/heroic/heroes/${heroFile}`);
    heroCollection.set(hero.position, hero)
}

for (const minionFile of minions) {
    let minion = require(__dirname + `/../assets/heroic/minions/${minionFile}`);
    minionCollection.set(minion.position, minion)
}


module.exports = {
    name: "random",
    aliases: ["r"],
    description: "Generates a random deck for both players",
    usage: "random [**-no-mythicals**': No mythical minion should be included | **-no-legendaries**: No legendary minion should be included | **-unique**: Every minion is unique]",
    run: async (client, message, args) => {

        // get random hero and minions for both teams
        const team1Hero = getRandomItem(heroCollection);
        const team2Hero = getRandomItem(heroCollection);
        const team1Minions = getRandomMinions(minionCollection, maxMinions, args).array();
        const team2Minions = getRandomMinions(minionCollection, maxMinions, args).array();

        // create background image
        const canvas = Canvas.createCanvas(2000, 1000);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage(__dirname + '/../assets/heroic/layout/base.png');

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // place team 1 image on background
        const team1Image = await Canvas.loadImage(team1Hero.src);
        ctx.drawImage(team1Image, 0, 0, 2000, 500);
        await placeMinionsOnHeroTemplate(ctx, team1Minions);

        // place team 1 image on background
        const team2Image = await Canvas.loadImage(team2Hero.src);
        ctx.drawImage(team2Image, 0, 500, 2000, 500);
        await placeMinionsOnHeroTemplate(ctx, team2Minions, true);

        // create the "VS" image in the middle
        const vsImage = await Canvas.loadImage(__dirname + '/../assets/heroic/layout/vs.png');
        ctx.globalAlpha = 0.7;
        ctx.drawImage(vsImage, canvas.width / 2, 450, 100, 100);

        // set the canvas to the message attachment
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'random-deck-image.png');

        // send the attachment in the message channel with a content
        message.channel.send(`${message.author},`, attachment);
    }
}

function getRandomItem(iterable) {
    return iterable.get([...iterable.keys()][Math.floor(Math.random() * iterable.size)])
}

function getRandomMinions(itemsCollection, n, args) {
    let restructuredItems = new Discord.Collection();
    let alreadyFilledMinions = new Discord.Collection();

    for (let i = 1; i <= n; i++) {

        let item = itemsCollection.random()

        // remove mythical minions if the argument is set
        if (args.includes('-no-mythicals') && item.mythical === true) {
            i--;
            continue;
        }

        // remove legendary minions if the argument is set
        if (args.includes('-no-legendaries') && item.legendary === true) {
            i--;
            continue;
        }

        if (alreadyFilledMinions.has(item.name) === false) {
            restructuredItems.set(i, item)
            alreadyFilledMinions.set(item.name, 1); // we can hardcode the value
            continue;
        }

        // every minion should available once
        if (args.includes('-unique')) {
            i--;
            continue;
        }

        if (item.legendary === true) {
            i--;
            continue;
        }

        // max minion count of one minion is 2
        if (alreadyFilledMinions.get(item.name) === 2) {
            i--;
            continue;
        }

        restructuredItems.set(i, item);
        alreadyFilledMinions.set(item.name, 2); // we can hardcode the value
    }

    return restructuredItems;
}

async function placeMinionsOnHeroTemplate(ctx, minions, lower = false) {
    let index = 0;
    let mapping = getMapping()

    minions.sort(function (minionA, minionB) {
        return minionA.position - minionB.position
    });

    for (const minion of minions) {
        const avatar = await Canvas.loadImage(minion.src);
        let map = mapping[index];

        if (lower) {
            map.y = map.y + 500;
        }

        ctx.drawImage(avatar, map.x, map.y, map.w, map.h);
        index++;
    }

    addTeamText(ctx, lower);
}


function addTeamText(ctx, lower = false) {
    ctx.save();
    if (!lower) {
        ctx.translate(100, 350);
    } else {
        ctx.translate(100, 850);
    }

    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = '#e31717';
    ctx.font = "80px Arial"

    if (!lower) {
        ctx.fillText("Team 1", 100, 0);
    } else {
        ctx.fillText("Team 2", 100, 0);
    }

    ctx.restore();
}
