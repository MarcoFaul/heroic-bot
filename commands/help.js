const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    run: async (client, message, args) => {
        if (args[0]) {
            return getCMD(client, message, args[0]);
        }

        return getAll(client, message);
    }
}

function getAll(client, message) {
    const embed = new MessageEmbed()
        .setTitle('Commands')
        .setDescription('List of all commands and their usage')

    client.commands.forEach((command, i) => {

        if (command.name === 'help') {
            return;
        }

        embed
            .addField(`**Command**:`, `\n\`!${command.name}\``, true)
            .addField(`\n**Aliases**:`, `${command.aliases.map(a => `\`!${a}\``).join(", ")}`, true)
            .addField(`**Usage**:`, `${command.usage}`)
            .addField(`**Description**:`, `${command.description}`)

    });

    embed.setFooter(`Syntax: <> = required, [] = optional`);
    return message.channel.send(embed);
}

function getCMD(client, message, input) {
    const embed = new MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `No information found for command **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    if (cmd.name) info = `**Command name**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = required, [] = optional`);
    }

    return message.channel.send(embed.setColor("GREEN").setDescription(info));
}
