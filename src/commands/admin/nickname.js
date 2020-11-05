module.exports = {
  name: "nick",
  aliases: ["botname"],
  category: "Developer",
  options: [""],
  usage: "nickname <newNickname>",
  descriptions: "Change bot nickname in a guild",
  cooldown: "",
  ownerOnly: false,
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
