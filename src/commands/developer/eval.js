const Discord = require('discord.js')
const moment = require('moment')
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
    message.delete()
    try {
      function clean(text) {
        if (typeof text === "string")
          return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
      }
      let codein = args.slice(0).join(" ");
      if (!codein) return

      let code;
      if ((codein.includes('--silent') && codein.includes('--async'))) {
        codein = codein.replace('--async', '').replace('--silent', '');
        await eval(`(aysnc () {
            ${codein}
          })()`)
        return;
      } else if (codein.includes('--async')) {
        codein = codein.replace('--async', '')
        code = await eval(`(async function() {
            ${codein}
          })()`)
      } else if (codein.includes('--silent')) {
        codein = codein.replace('--silent', '')
        await eval(codein)
        return;
      } else {
        code = await eval(codein)
      }

      if (typeof code !== 'string') {
        code = require('util').inspect(code, {
          depth: 0
        });
      }

      var output = await message.channel.send(`\`\`\`js\n${clean(code).replace(client.token, "-").replace(process.env, "-")}\n\`\`\``)
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
    } catch (e) {
      var output = await message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
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
  }
}