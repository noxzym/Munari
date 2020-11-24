const Discord = require("discord.js");
module.exports = {
  name: "rate",
  aliases: [""],
  category: "Actions",
  descriptions: "rate someone",
  usage: "rate [user]",
  options: [""],
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    let ratus =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first() ||
      message.member;
    if (ratus.id === client.user.id) return;
    if (!ratus) return message.channel.send("Tag someone to rate them!");

    let rates = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    let result = Math.floor(Math.random() * rates.length);

    message.channel
      .send(`Hold a moment <a:loading1:753610786991112282>`)
      .then(msg => {
        setTimeout(function() {
          msg.edit(`${ratus} have ${result}/10 score`);
        }, 5000);
      });
  }
};
