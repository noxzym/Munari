const figlet = require("figlet");
module.exports = {
  name: "ascii",
  aliases: [""],
  category: "Fun",
  descriptions: "convert text to ascii style",
  usage: "ascii <text>",
  options: [""],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const text = args.join(" ");

    if (!text) {
      return message.channel.send("Please provide some text.");
    }
    
    if(text.length > 15) return message.channel.send(`Your provide text over size`)

    figlet.text(text, (e, txt) => {
      if (e) return;
      message.channel.send(`\`\`\` ${txt.trimRight()} \`\`\``);
    });
  },
};