const Discord = require("discord.js");
const { createEmbed } = require('../../utils/Function')
module.exports = {
  name: "help",
  aliases: ["h", "?"],
  category: "Utility",
  descriptions: "Display Help Commands",
  usage: "help [commands]",
  options: ["--all"],
  cooldown: "3",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const prefix = client.config.prefix

    let commands = client.commandmanager.command
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
      .filter(({ category }) => category === 'Moderation')
      .map(({ name }) => `**\`${name}\`**`)
      .join(", ");

    if (message.content.includes("1")) {
      let e = createEmbed("info")
        .setAuthor("Category • Animal", client.user.avatarURL())
        .addField("Commands", animal)
        .setTimestamp()
        .setFooter(`"${prefix}help [command]" to get more Information`, message.author.avatarURL({ dynamic: true }))
      return message.channel.send(e)
    }
    if (message.content.includes("2")) {
      let e = createEmbed("info")
        .setAuthor("Category • Action", client.user.avatarURL())
        .addField("Commands", actions)
        .setTimestamp()
        .setFooter(`"${prefix}help [command]" to get more Information`, message.author.avatarURL({ dynamic: true }))
      return message.channel.send(e)
    }
    if (message.content.includes("3")) {
      let e = createEmbed("info")
        .setAuthor("Category • Image", client.user.avatarURL())
        .addField("Commands", image)
        .setTimestamp()
        .setFooter(`"${prefix}help [command]" to get more Information`, message.author.avatarURL({ dynamic: true }))
      return message.channel.send(e)
    }
    if (message.content.includes("4")) {
      let e = createEmbed("info")
        .setAuthor("Category • General", client.user.avatarURL())
        .addField("Commands", general)
        .setTimestamp()
        .setFooter(`"${prefix}help [command]" to get more Information`, message.author.avatarURL({ dynamic: true }))
      return message.channel.send(e)
    }
    if (message.content.includes("5")) {
      let e = createEmbed("info")
        .setAuthor("Category • Fun", client.user.avatarURL())
        .addField("Commands", fun)
        .setTimestamp()
        .setFooter(`"${prefix}help [command]" to get more Information`, message.author.avatarURL({ dynamic: true }))
      return message.channel.send(e)
    }
    if (message.content.includes("6")) {
      let e = createEmbed("info")
        .setAuthor("Category • Utility", client.user.avatarURL())
        .addField("Commands", utility)
        .setTimestamp()
        .setFooter(`"${prefix}help [command]" to get more Information`, message.author.avatarURL({ dynamic: true }))
      return message.channel.send(e)
    }
    if (message.content.includes("7")) {
      let e = createEmbed("info")
        .setAuthor("Category • Music", client.user.avatarURL())
        .addField("Commands", music)
        .setTimestamp()
        .setFooter(`"${prefix}help [command]" to get more Information`, message.author.avatarURL({ dynamic: true }))
      return message.channel.send(e)
    }
    if (message.content.includes("8")) {
      let e = createEmbed("info")
        .setAuthor("Category • Moderation", client.user.avatarURL())
        .addField("Commands", Admin)
        .setTimestamp()
        .setFooter(`"${prefix}help [command]" to get more Information`, message.author.avatarURL({ dynamic: true }))
      return message.channel.send(e)
    }

    const animalsize = client.commandmanager.command.filter(x => x.category === 'Animal').size
    const actsize = client.commandmanager.command.filter(x => x.category === 'Actions').size
    const imgsize = client.commandmanager.command.filter(x => x.category === 'Image').size
    const gensize = client.commandmanager.command.filter(x => x.category === 'General').size
    const funsize = client.commandmanager.command.filter(x => x.category === 'Fun').size
    const utisize = client.commandmanager.command.filter(x => x.category === 'Utility').size
    const musicsize = client.commandmanager.command.filter(x => x.category === 'Music').size
    const adminsize = client.commandmanager.command.filter(x => x.category === 'Moderation').size

    const totalcmd = animalsize + actsize + imgsize + gensize + funsize + utisize + musicsize + adminsize

    if (message.content.includes('--all')) {
      let hembed = new Discord.MessageEmbed()
        .setAuthor('Munari Help Commands', client.user.displayAvatarURL())
        .setColor(message.member.displayHexColor)
        .setDescription(`Type **\`${prefix}help [command]\`** to get how to use commands`)
        .setThumbnail(client.user.displayAvatarURL())
        .addField(`**\`【🐶】\` • Animal \`[${animalsize}]\`**`, animal)
        .addField(`**\`【😉】\` • Action \`[${actsize}]\`**`, actions)
        .addField(`**\`【🖼️】\` • Image \`[${imgsize}]\`**`, image)
        .addField(`**\`【🎭】\` • General \`[${gensize}]\`**`, general)
        .addField(`**\`【🎲】\` • Fun Game \`[${funsize}]\`**`, fun)
        .addField(`**\`【🛠️】\` • Utility \`[${utisize}]\`**`, utility)
        .addField(`**\`【🎧】\` • Music \`[${musicsize}]\`**`, music)
        .addField(`**\`【⚙️】\` • Moderation \`[${adminsize}]\`**`, Admin)
        .addField('\u200B', "**【[VOTE ME](https://top.gg/bot/740112353483554858/vote)】 • 【[INVITE ME](https://discord.com/oauth2/authorize?client_id=740112353483554858&scope=bot&permissions=2146827639)】**")
        .setFooter(`Commanded by ${message.author.tag} | ${totalcmd} commands has been loaded`, message.author.avatarURL({ dynamic: true }))
        .setTimestamp()
      return message.channel.send(hembed)
    }

    const cmdArgs = args.join(" ")
    if (cmdArgs) {
      const cmd = client.commandmanager.command.get(cmdArgs) || client.commandmanager.command.get(client.commandmanager.aliases.get(cmdArgs));
      if ((cmd.category === 'Developer' || cmd.category === '')) return
      if (!cmd) return

      const aliases = cmd.aliases ? cmd.aliases.map((x) => x) : "-";
      const options = cmd.options ? cmd.options.map((x) => x) : "-";
      const cooldown = cmd.cooldown ? `${cmd.cooldown}s` : "Nothing";
      const usage = cmd.usage ? `${prefix}${cmd.usage}` : "Not specified"
      const description = cmd.descriptions ? cmd.descriptions : "Not specified"

      const embed = createEmbed()
        .setColor(message.member.displayHexColor)
        .setDescription(`**__Help Commands__**\n**\`\`\`asciidoc\n• Name        :: ${cmd.name}\n• Aliases     :: ${aliases}\n• Category    :: ${cmd.category}\n• Options     :: ${options}\n• Description :: ${description}\n• Usage       :: ${usage}\n• Cooldowns   :: ${cooldown}\n\`\`\`**`)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Don't include <> or []. It's mean, <> is required and [] is optional`)
      return message.channel.send(embed);
    }

    let hembed = new Discord.MessageEmbed()
      .setAuthor('Munari Help Commands', client.user.displayAvatarURL())
      .setColor(message.member.displayHexColor)
      .setDescription(`Type **\`${prefix}help [Category]\`** to view command list\nTo view all commands use **\`${prefix}help --all\`**\n\n**Category**\n**\`【🐶】\` Animal \`help 1\`\n\`【😉】\` Action \`help 2\`\n\`【🖼】\` Image \`help 3\`\n\`【🎭】\` General \`help 4\`\n\`【🎲】\` Fun \`help 5\`\n\`【🛠️】\` Utility\`help 6\`\n\`【🎧】\` Music \`help 7\`\n\`【⚙️】\` Moderation \`help 8\`\n\n【[VOTE ME](https://top.gg/bot/740112353483554858/vote)】【[INVITE ME](https://discord.com/oauth2/authorize?client_id=740112353483554858&scope=bot&permissions=2146827639)】**`)
      .setFooter(`Commanded by ${message.author.tag} | ${totalcmd} commands has been loaded`, message.author.avatarURL({ dynamic: true }))
      .setTimestamp()
    return message.channel.send(hembed)
  }
}