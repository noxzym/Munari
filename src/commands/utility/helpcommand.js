const Discord = require("discord.js");
const { readdirSync } = require("fs");
module.exports = {
  name: "help",
  aliases: ["h", "?"],
  category: "Utility",
  descriptions: "Display Help Commands",
  usage: "help [commands]",
  options: [""],
  cooldown: "3",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message, args) {

    const prefix = 'm!';
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
        .setColor(message.member.displayHexColor)
        .setDescription(`**__Help Commands__**\n**\`\`\`asciidoc\n• Name        :: ${cmd.name}\n• Aliases     :: ${aliases}\n• Category    :: ${cmd.category}\n• Options     :: ${options}\n• Description :: ${description}\n• Usage       :: ${usage}\n• Cooldowns   :: ${cooldown}\n\`\`\`**`)
        .setThumbnail(bot.user.displayAvatarURL())
        .setFooter(`Don't include <> or []. It's mean, <> is required and [] is optional`)
      return message.channel.send(embed);
    }

    let commands = bot.commands
    const Developer = commands
      .filter(({ category }) => category === 'Developer')
      .map(({ name }) => `**\`${name}\`**`)
      .join(", ");
    const animal = commands
      .filter(({ category }) => category === 'Animal')
      .map(({ name }) => `**\`${name}\`**`)
      .join(", ");
    const actions = commands
      .filter(({ category }) => category === 'Actions')
      .map(({ name }) => `**\`${name}\`**`)
      .join(", ");
    const image = commands
      .filter(({ category }) => category === 'Image')
      .map(({ name }) => `**\`${name}\`**`)
      .join(", ");
    const general = commands
      .filter(({ category }) => category === 'General')
      .map(({ name }) => `**\`${name}\`**`)
      .join(", ");
    const fun = commands
      .filter(({ category }) => category === 'Fun')
      .map(({ name }) => `**\`${name}\`**`)
      .join(", ");
    const utility = commands
      .filter(({ category }) => category === 'Utility')
      .map(({ name }) => `**\`${name}\`**`)
      .join(", ");
    const music = commands
      .filter(({ category }) => category === 'Music')
      .map(({ name }) => `**\`${name}\`**`)
      .join(", ");
    const Admin = commands
      .filter(({ category }) => category === 'Administration')
      .map(({ name }) => `**\`${name}\`**`)
      .join(", ");

    const animalsize = bot.commands.filter(x => x.category === 'Animal').size
    const actsize = bot.commands.filter(x => x.category === 'Actions').size
    const imgsize = bot.commands.filter(x => x.category === 'Image').size
    const gensize = bot.commands.filter(x => x.category === 'General').size
    const funsize = bot.commands.filter(x => x.category === 'Fun').size
    const utisize = bot.commands.filter(x => x.category === 'Utility').size
    const musicsize = bot.commands.filter(x => x.category === 'Music').size
    const adminsize = bot.commands.filter(x => x.category === 'Administration').size

    const totalcmd = animalsize + actsize + imgsize + gensize + funsize + utisize + musicsize + adminsize


    let hembed = new Discord.MessageEmbed()
      .setAuthor('Munari Help Commands', bot.user.displayAvatarURL())
      .setColor(message.member.displayHexColor)
      .setDescription(`Type **\`${prefix}help [command]\`** to get how to use commands`)
      .setThumbnail(bot.user.displayAvatarURL())
      .addField(`**\`【🐱】\` • Animal \`[${animalsize}]\`**`, animal)
      .addField(`**\`【☺️】\` • Action \`[${actsize}]\`**`, actions)
      .addField(`**\`【🖼️】\` • Image \`[${imgsize}]\`**`, image)
      .addField(`**\`【🎭】\` • General \`[${gensize}]\`**`, general)
      .addField(`**\`【🎲】\` • Fun Game \`[${funsize}]\`**`, fun)
      .addField(`**\`【🛠️】\` • Utility \`[${utisize}]\`**`, utility)
      .addField(`**\`【🎧】\` • Music \`[${musicsize}]\`**`, music)
      .addField(`**\`【⚙️】\` • Moderation \`[${adminsize}]\`**`, Admin)
      .addField('\u200B', "**【[VOTE ME](https://top.gg/bot/740112353483554858/vote)】 • 【[INVITE ME](https://discord.com/oauth2/authorize?client_id=740112353483554858&scope=bot&permissions=2146827639)】**")
      .setFooter(`Commanded by ${message.author.tag} | ${totalcmd} commands has been loaded`, message.author.avatarURL({ dynamic: true }))
      .setTimestamp()
    message.channel.send(hembed)
  }
}