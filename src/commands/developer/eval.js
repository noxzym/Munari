const Discord = require('discord.js-light')
const db = require('quick.db')
const moment = require('moment')
const prefix = require('discord-prefix')
module.exports = {
  name: "eval",
  aliases: ["ev"],
  category: "Developer",
  descriptions: "",
  usage: "ev <code>",
  options: [""],
  cooldown: "",
  ownerOnly: true,
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
      
      let embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setAuthor('Eval Commands')
        .setDescription(`**Input\n\`\`\`js\n${codein}\n\`\`\`\nOutput\n\`\`\`js\n${clean(code).replace(client.token, "NO TOKEN FOR YOU!")}\n\`\`\`**`)
        message.channel.send(embed)
    
    //    message.channel.send(`**Input\n\`\`\`js\n${codein}\n\`\`\`\nOutput\n\`\`\`js\n${clean(code).replace(client.token, "NO TOKEN FOR YOU!")}\n\`\`\`**`)
    } catch(e) {
        
        message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
    }
  }
}