const { Message, Guild, TextChannel, VoiceChannel, MessageEmbed, MessageAttachment, DMChannel, NewsChannel, VoiceConnection, Collection, ClientEvents, VoiceState, Util } = require('discord.js');
const req = require('snekfetch')
const util = require('util')
module.exports = {
  name: "eval",
  aliases: ["ev"],
  category: "Developer",
  descriptions: "",
  usage: "ev <code>",
  options: [""],
  cooldown: "",
  ownerOnly: true,
  guildOnly: true,
  async run(client, message, args) {
    message.delete();
    let codein = args.slice(0).join(" ");
    if (!codein) return

    let code;

    try {

      if ((codein.includes('--silent') && codein.includes('--async'))) {

        codein = codein.replace('--async', '').replace('--silent', '');
        await eval(`(aysnc () {${codein}})()`)
        return;

      } else if (codein.includes('--async')) {

        codein = codein.replace('--async', '')
        code = await eval(`(async function() {${codein}})()`)

      } else if (codein.includes('--silent')) {

        codein = codein.replace('--silent', '')
        await eval(codein)
        return;

      } else {

        code = await eval(codein)

      }

      var outputcode = util.inspect(code, { depth: 0 });

      var output;

      if (outputcode.length > 1024) {

        const { body } = await req.post('https://paste.mod.gg/documents').send(outputcode)
        let withhaste = new MessageEmbed()
          .addField("Input", `\`\`\`js\n${codein}\`\`\``)
          .addField(`Output`, `https://paste.mod.gg/${body.key}`)
          .addField(`Typecode`, typeof code)
        output = await message.channel.send(withhaste)

      } else {

        let withouthaste = new MessageEmbed()
          .addField("Input", `\`\`\`js\n${codein}\`\`\``)
          .addField(`Output`, `\`\`\`js\n${clean(outputcode).replace(client.token, "-")}\n\`\`\``)
          .addField(`Typecode`, typeof code)
        output = await message.channel.send(withouthaste)

      }

      await output.react('❎')

      const filter = (reaction, user) => {
        return ['❎'].includes(reaction.emoji.name) && user.id === message.author.id;
      };

      output.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
          const reaction = collected.first();
          if (reaction.emoji.name === '❎') {
            output.delete()
          } else { return }
        })
        .catch(e => { return });

    } catch (error) {
      
      var output;

      if (error.length > 1024) {
        const { body } = await req.post('https://paste.mod.gg/documents').send(error)
        let hastewith = new MessageEmbed()
          .addField("Input", `\`\`\`js\n${codein}\`\`\``)
          .addField(`Error`, `https://paste.mod.gg/${body.key}.js`)
        output = await message.channel.send(hastewith)
      } else {
        let nohaste = new MessageEmbed()
          .addField("Input", `\`\`\`js\n${codein}\`\`\``)
          .addField(`Error`, `\`\`\`js\n${error}\n\`\`\``)
        output = await message.channel.send(nohaste)
      }

      await output.react('❎')

      const filter = (reaction, user) => {
        return ['❎'].includes(reaction.emoji.name) && user.id === message.author.id;
      };

      output.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
          const reaction = collected.first();
          if (reaction.emoji.name === '❎') {
            output.delete()
          } else { return }
        })
        .catch(e => { return });
    }

    function clean(text) {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    }
  }
}
