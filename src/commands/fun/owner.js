module.exports = {
  name: "owner",
  category: "Fun",
  cooldown: "5",
  async run(bot, message, args) {
    let owner =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!owner)
      return message.channel.send("Please mention member first");

    message.channel
      .send(`Hold a moment <a:loading1:753610786991112282>`)
      .then(msg => {
        setTimeout(function() {
          msg.edit(`Now the server owner has change to ${owner}`);
        }, 5000);
      });
  }
};
