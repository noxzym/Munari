module.exports = {
  name: "owner",
  aliases: null,
  category: "Fun",
  descriptions: "Only fun command",
  usage: "owner <user>",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    let owner =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!owner)
      return message.channel.send("Please mention member first").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

    message.channel
      .send(`Hold a moment <a:loading1:753610786991112282>`)
      .then(msg => {
        setTimeout(function() {
          msg.edit(`Now the server owner has change to ${owner}`);
        }, 5000);
      });
  }
};
