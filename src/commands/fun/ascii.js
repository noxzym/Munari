const figlet = require("figlet");
module.exports = {
  name: "ascii",
  aliases: [""],
  category: "Fun",
  descriptions: "convert text to ascii word",
  usage: "ascii <text>",
  options: [""],
  cooldown: "5",
  ownerOnly: false,
  async run(client, message, args) {
    const text = args.join(" ");

    if (!text) {
      return message.channel.send("Please provide some text.");
    }

    figlet.text(text, (e, txt) => {
      if (e) return;
      message.channel.send(`\`\`\` ${txt.trimRight()} \`\`\``);
    });
  },
};