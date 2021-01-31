const figlet = require("figlet");
module.exports = {
  name: "ascii",
  aliases: null,
  category: "Fun",
  descriptions: "convert text to ascii style",
  usage: "ascii <text>",
  options: null,
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    const text = args.join(" ");

    if (!text) {
      return message.channel.send("Please provide some text.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    }
    
    if (text.length > 15) return message.channel.send(`Your provide text oversize`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

    figlet.text(text, (e, txt) => {
      if (e) return;
      message.channel.send(`**\`\`\`${txt}\`\`\`**`);
    });
  },
};