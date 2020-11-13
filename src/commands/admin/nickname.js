module.exports = {
  name: "botnick",
  aliases: [""],
  category: "Administrator",
  options: [""],
  usage: "botnick <newNickname>",
  descriptions: "Change bot nickname in a guild",
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const nickname = args.join(" ");

    message.guild.members.cache
      .get(client.user.id)
      .setNickname(nickname);

    message.channel.send(
      `Bot nickname has update to **${nickname}**`
    );
  }
};
