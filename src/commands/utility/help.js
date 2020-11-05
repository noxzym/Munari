const Discord = require("discord.js-light");
const PREFIX = require('discord-prefix')
const { readdirSync } = require("fs");
const db = require('quick.db')
module.exports = {
  name: "help",
  aliases: ["h"],
  category: "Utility",
  descriptions: "Display Help Commands",
  usage: "help [commands]",
  options: [""],
  cooldown: "3",
  ownerOnly: false,
  async run(bot, message, args) {
    
      const prefix = await PREFIX.getPrefix(message.guild.id) || 'm!';
      const cmdArgs = args.join(" ")
      
    if (cmdArgs) {
      const cmd = bot.commands.get(cmdArgs) || bot.commands.get(bot.aliases.get(cmdArgs));
      if (!cmd) return message.channel.send("Command or alias not found");

      const aliases = cmd.aliases ? cmd.aliases.map((alias) => alias) : "None";
      const options = cmd.options ? cmd.options.map((option) => option) : "None";
      const cooldown = cmd.cooldown ? `${cmd.cooldown}s` : "None";
      const usage = cmd.usage ? `${prefix}${cmd.usage}` : "Not specified"
      const description = cmd.description ? cmd.description : "Not specified"
      
      const embed = new Discord.MessageEmbed()
        // .setColor("#0099ff")
        // .setTitle(`Command Name : ${cmd.name}`)
        // .addField("Aliases", aliases, true)
        // .addField("Cooldown", `${cooldown}`, true)
        // .addField("Usage", cmd.usage ? `${prefix}${cmd.usage}` : "Not specified", true)
        // .addField("Category", cmd.category, true)
        // .addField("Description", cmd.description ? cmd.description : "Not specified")
        // .addField("Options", options);
      .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
      .setDescription(`**__Help Commands__**\n**\`\`\`asciidoc\n• Name        :: ${cmd.name}\n• Aliases     :: ${aliases}\n• Category    :: ${cmd.category}\n• Options     :: ${options}\n• Description :: ${description}\n• Usage       :: ${usage}\n• Cooldowns   :: ${cooldown}\n\`\`\`**`)
      .setThumbnail(bot.user.displayAvatarURL())
      .setFooter(`Don't include <> or []. It's mean, <> is required and [] is optional`)
      return message.channel.send(embed);
    }
    
    let commands = bot.commands
    const Admin = commands
    .filter(({category}) => category === 'Administration')
    .map(({ name }) => `**[\`${name}\`](https://munari.glitch.me/)**`)
    .join("  ");
    const Developer = commands
    .filter(({category}) => category === 'Developer')
    .map(({ name }) => `**[\`${name}\`](https://munari.glitch.me/)**`)
    .join("  ");
    const fun = commands
    .filter(({category}) => category === 'Fun')
    .map(({ name }) => `**[\`${name}\`](https://munari.glitch.me/)**`)
    .join("  ");
    const actions = commands
    .filter(({category}) => category === 'Actions')
    .map(({ name }) => `**[\`${name}\`](https://munari.glitch.me/)**`)
    .join("  ");
    const image = commands
    .filter(({category}) => category === 'Image')
    .map(({ name }) => `**[\`${name}\`](https://munari.glitch.me/)**`)
    .join("  ");
    const general = commands
    .filter(({category}) => category === 'General')
    .map(({ name }) => `**[\`${name}\`](https://munari.glitch.me/)**`)
    .join("  ");
    const music = commands
    .filter(({category}) => category === 'Music')
    .map(({ name }) => `**[\`${name}\`](https://munari.glitch.me/)**`)
    .join("  ");
    const utility = commands
    .filter(({category}) => category === 'Utility')
    .map(({ name }) => `**[\`${name}\`](https://munari.glitch.me/)**`)
    .join("  ");
    
    
    let hembed = new Discord.MessageEmbed()
    .setAuthor('Munari Help Commands', bot.user.displayAvatarURL())
    .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
    .setDescription(`Type **\`${prefix}help [command]\`** to get how to use commands`)
    // .setDescription(`Halo ${message.author}, Saya adalah bot Discord buatan Indonesia :flag_id:.\n Don't forget to [invite](https://bit.ly/Takagi-Bot) me to your server\nMention saya untuk mengetahui prefixnya.\nGunakan \`${[prefix]}help [command]\` untuk mengetahui cara menggunakannya`)
    .setThumbnail(bot.user.displayAvatarURL())
    .addField('**\`【🎭】\` • __GENERAL__**', general)
    .addField('**\`【☺️】\` • __Actions__**', actions)
    .addField('**\`【🖼️】\` • __Images__**', image)
    .addField('**\`【🎲】\` • __FUN GAME__**', fun)
    .addField('**\`【🛠️】\` • __UTILITY__**', utility)
    .addField('**\`【⚙️】\` • __ADMINISTRATION__**', Admin)
    .addField('**\`【🎧】\` • __MUSIC__**', music)
    // .addField('**\`【💻】\` • __Developer__**', Developer)
    .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
    .setTimestamp()
    message.channel.send(hembed)
  }
}