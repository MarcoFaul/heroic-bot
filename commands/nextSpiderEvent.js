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
        embed.addField(`**Next hero**:`, `\n\`${client.heroes.get(client.config.nextSpiderEventHero).name}\``, true)
        embed.addField(`**Solo starts**:`, `\n\`${client.config.soloSpiderEventStart}\``, true)
        embed.addField(`**Guild starts**:`, `\n\`${client.config.guildSpiderEventStart}\``, true)
        embed.addField(`**Hero order**:`, `\n\`${heroOrder}\``, true)
        embed.addField(`**Best advices**:`, `\n\https://www.youtube.com/channel/UCEGGisfbz18_ZoPqH607sdg/featured`, true)

        message.reply(embed);
    }
}
