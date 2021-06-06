const Discord = require('discord.js');

module.exports = {
    name: "nextevent",
    aliases: ["next", "nextinfo", "nexthero", "infopls", "gimmenexthero"],
    description: "Get necessary information about the upcoming spider event",
    usage: "!nextevent",
    run: async (client, message, args) => {
        let heroOrder = '';

        client.heroes.forEach(hero => {
            heroOrder += `${hero.position}: ${hero.name}\n`
        })

        const embed = new Discord.MessageEmbed()
        embed.setTitle('Spider event overview');
        embed.addField(`**Next/current hero**:`, `\n\`${client.heroes.get(client.config.nextSpiderEventHero).name}\``, true)
        embed.addField(`**Next guild attack in**:`, `\n\`${getNextGuildCountdown(client)}\``, true)
        embed.addField(`**Hero order**:`, `\n\`${heroOrder}\``, true)
        embed.addField(`**Best advices**:`, `\n\https://www.youtube.com/channel/UCEGGisfbz18_ZoPqH607sdg/featured`, true)

        message.delete();
        message.reply(embed);
    }
}

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

    return `${rhours}h ${rminutes}m`;
}

const getNextGuildCountdown = (client) => {
    let message = `¯\\_(ツ)_/¯`;

    client.guildAttackReminders.forEach((nextGuildAttack, key) => {
        let nearestEvent = -99999999;

        nextGuildAttack.forEach(nextAttack => {
            tempStart = new Date(client.config.guildSpiderEventStart);
            tempCurrentDate = new Date();
            tempStart.setMinutes(tempStart.getMinutes() + nextAttack.start);

            // get the different in minutes
            let difference = tempCurrentDate.getTime() - tempStart.getTime();
            let resultInMinutes = Math.round(difference / 60000);

            // we want to get the lowest negative number for the next attack
            if (Math.sign(resultInMinutes) !== -1) {
                return;
            }

            if (nearestEvent < resultInMinutes) {
                nearestEvent = resultInMinutes
            }
        })

        message = getText(Math.abs(nearestEvent));
    })

    return message;
}
