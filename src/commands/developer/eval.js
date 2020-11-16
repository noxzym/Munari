const Discord = require('discord.js-light')
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
  async run(client, message) {
  message.delete()
  const args = message.content.split(" ").slice(1);
  try {
    function clean(text) {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    }
        let codein = args.join(" ");
        if(!codein) return
        let code = await eval(codein);    

        if (typeof code !== 'string')
            code = require('util').inspect(code, { depth: 0 });

      var output = await message.channel.send(`\`\`\`js\n${clean(code).replace(client.token, "-")}\n\`\`\``)
      await output.react('❎')
      const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
      var collector = output.createReactionCollector(filter, {time: 60000});
      collector.on("collect", (reaction, user) => {
        if (collector && !collector.ended) collector.stop();
        switch (reaction.emoji.name) {
          case "❎":
            output.delete()
            break;

          default:
              reaction.users.remove(user).catch(console.error);
              break;
        }
      });
      collector.on("end", () => {
        output.reactions.removeAll().catch(console.error);
      });

    } catch(e) {
        message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
    }
  }
}