const Discord = require("discord.js-light")
module.exports = {
  name: "ban",
  aliases: [""],
  category: "Administration",
  descriptions: "Ban a user from guild",
  usage: "ban <user> [reason]",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message, args) {
    const prefix = "m!";
    if (!message.member.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR"))
      return message.channel.send(
        `You don't have permissions \`BAN_MEMBERS\` or \`ADMINISTRATOR\``
      );

    let member =
      message.guild.member(message.mentions.members.first()) ||
      message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(`usage: ${prefix + this.usage}`);
    if (member.hasPermission("ADMINISTRATOR"))
      return message.channel.send("This member can't be banned");

    if (
      message.guild.me.roles.highest.comparePositionTo(member.roles.highest) < 0
    ) {
      return message.channel.send(
        `My Highest role must be higher than **\`${member.user.username}\`** highest role!`
      );
    }

    if (member.id === message.author.id)
      return message.channel.send("You can't banned yourself");

    let reason = args.join(" ").slice(22);

    if (!reason) {
      reason = "-";
    } else {
      reason = `${reason}`;
    }

    try {
      var react = await message.channel.send(
        `Are you sure to Ban **\`${member.user.tag}\`**?`
      );
      await react.react("✅");
      await react.react("❎");
      const filter = (reaction, user) =>
        user.id !== message.client.user.id && user.id === message.author.id;
      var collector = react.createReactionCollector(filter);
      collector.on("collect", (reaction, user) => {
        if (collector && !collector.ended) collector.stop();
        switch (reaction.emoji.name) {
          case "✅":
            reaction.users.remove(user).catch(console.error);
            react.edit(
              `<a:yes:765207711423004676> | Banned **\`${member.user.tag}\`** successful!`
            );
            member
              .ban({ reason: reason })
              .catch(e =>
                message.channel.send(
                  `Sorry i couldn't ban this user because ${e}`
                )
              );
            break;

          case "❎":
            reaction.users.remove(user).catch(console.error);
            react.edit(
              `<a:no:765207855506522173> | Banned **\`${member.user.tag}\`** has canceled!`
            );
            break;

          default:
            reaction.users.remove(user).catch(console.error);
            break;
        }
      });
      collector.on("end", () => {
        react.reactions.removeAll().catch(console.error);
      });
    } catch (e) {
      console.log(e);
    }
  }
};