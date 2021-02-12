const { Message, Guild, TextChannel, VoiceChannel, MessageEmbed, MessageAttachment, DMChannel, NewsChannel, VoiceConnection, Collection, ClientEvents, VoiceState, Util } = require('discord.js');
const { Deleted } = require("../../utils/Function")
const req = require('snekfetch')
const util = require('util')

module.exports = {
  name: "eval",
  aliases: ["ev"],
  category: "Developer",
  descriptions: "Run code snippet",
  usage: "eval <code>",
  options: null,
  cooldown: null,
  ownerOnly: true,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES") ? message.delete() : undefined
    let codein = args.slice(0).join(" ");
    if (!codein) return

    let code;
    try {

      if ((codein.includes('--async') && codein.includes('--silent'))) {
        codein = codein.replace(/\`\`\`/g, "").trim().replace('--async', '').replace('--silent', '');
        await eval(`(async function() {
          ${codein}
        })()`)
        return;
      } else if (codein.includes('--async')) {
        codein = codein.replace('--async', '')
        code = await eval(`(async function() {${codein.replace(/\`\`\`/g, "").trim()}})()`)
      } else if (codein.includes('--silent')) {
        codein = codein.replace(/\`\`\`/g, "").trim().replace('--silent', '')
        await eval(codein)
        return;
      } else {
        code = await eval(codein.replace(/\`\`\`/g, "").trim())
      }

      var outputcode = util.inspect(code, { depth: 0 });
      var output;
      if (outputcode.length > 1024) {
        const { body } = await req.post('https://paste.mod.gg/documents').send(outputcode)
        let withhaste = new MessageEmbed()
          .addField("Input", `\`\`\`js\n${codein.replace(/\`\`\`/g, "").trim()}\`\`\``)
          .addField(`Output`, `https://paste.mod.gg/${body.key}`)
          .addField(`Typecode`, typeof code)
        output = await message.channel.send(withhaste)
      } else {
        let withouthaste = new MessageEmbed()
          .addField("Input", `\`\`\`js\n${codein.replace(/\`\`\`/g, "").trim()}\`\`\``)
          .addField(`Output`, `\`\`\`js\n${await clean(outputcode).replace(client.token, " [SECRET] ")}\n\`\`\``)
          .addField(`Typecode`, typeof code)
        output = await message.channel.send(withouthaste)
      }

      Deleted(output, message)

    } catch (error) {
      var output;

      if (error.length > 1024) {
        const { body } = await req.post('https://paste.mod.gg/documents').send(error)
        let hastewith = new MessageEmbed()
          .addField("Input", `\`\`\`js\n${codein.replace(/\`\`\`/g, "").trim()}\`\`\``)
          .addField(`Error`, `https://paste.mod.gg/${body.key}.js`)
        output = await message.channel.send(hastewith)
      } else {
        let nohaste = new MessageEmbed()
          .addField("Input", `\`\`\`js\n${codein.replace(/\`\`\`/g, "").trim()}\`\`\``)
          .addField(`Error`, `\`\`\`js\n${error}\n\`\`\``)
        output = await message.channel.send(nohaste)
      }

      Deleted(output, message)
      
    }
  }
}

function clean(text) {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}