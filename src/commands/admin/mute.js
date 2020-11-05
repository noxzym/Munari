const Discord = require("discord.js-light");
module.exports = {
  name: "mute",
  aliases: [""],
  category: "Administration",
  descriptions: "Make a user ",
  usage: "mute <user>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  async run(bot, message, args) {
    message.delete();
    if (!message.member.hasPermission("MANAGE_ROLES" || "ADMINISTRATOR"))
      return message.channel.send(
        `You couldn't have permissions \`MANAGE_ROLES\` or \`ADMINISTRATOR\``
      );
    if (!message.guild.me.hasPermission("MANAGE_ROLES" || "ADMINISTRATOR"))
      return message.channel.send(
        `I couldn't have permissions \`MANAGE_ROLES\` or \`ADMINISTRATOR\``
      );

    let toMute =
      message.guild.member(message.mentions.users.first()) ||
      message.guild.members.cache.get(args[0]);
    if (!toMute) return;
    if (toMute.hasPermission("ADMINISTRATOR"))
      return message.channel.send(`This member can't be muted`);

    if (
      message.guild.me.roles.highest.comparePositionTo(toMute.roles.highest) < 0
    )
      return message.channel.send(
        `My Highest role must be higher than **\`${toMute.user.tag}\`** highest role!`
      );

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason given";

    let muteRole = message.guild.roles.cache.find(r => r.name === "TMute");
    if (!muteRole) {
      try {
        muteRole = await message.guild.roles.create({
          data: {
            name: "TMute",
            color: "#514f48",
            permissions: []
          }
        });
      } catch (e) {
        console.log(e.stack);
      }
    }

    message.guild.channels.cache.forEach(channel => {
      channel.updateOverwrite(muteRole, {
        SEND_MESSAGES: false,
        ATTACH_FILES: false,
        SEND_TTS_MESSAGES: false,
        ADD_REACTIONS: false,
        SPEAK: false,
        STREAM: false
      });
    });

    if (toMute.roles.cache.some(r => muteRole.id === r.id)) {
      return message.channel.send(`${toMute} Has been muted`);
    }
    try {
      var react = await message.channel.send(
        `Are you sure to Muted **\`${toMute.user.tag}\`**?`
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
              `<a:yes:765207711423004676> | Muted **\`${toMute.user.tag}\`** successful!`
            );
            toMute.roles.add(muteRole.id);
            break;

          case "❎":
            reaction.users.remove(user).catch(console.error);
            react.edit(
              `<a:no:765207855506522173> | Muted **\`${toMute.user.tag}\`** has canceled!`
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
