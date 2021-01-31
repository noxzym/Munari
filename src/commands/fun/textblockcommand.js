module.exports = {
  name: "textblock",
  aliases: null,
  category: "Fun",
  descriptions: "change text/number to textblokc",
  usage: "textblock [text/number]",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    const blocks = args
      .join(" ")
      .toLowerCase()
      .replace(/[a-z]/g, ":regional_indicator_$&:")
      .replace(/1/g, ":one:")
      .replace(/2/g, ":two:")
      .replace(/3/g, ":three:")
      .replace(/4/g, ":four:")
      .replace(/5/g, ":five:")
      .replace(/6/g, ":six:")
      .replace(/7/g, ":seven:")
      .replace(/8/g, ":eight:")
      .replace(/9/g, ":nine:")
      .replace(/0/g, ":zero:");
    message.channel.send(blocks);
  }
};