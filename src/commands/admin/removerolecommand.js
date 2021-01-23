const Discord = require("discord.js");
module.exports = {
  name: "removerole",
  aliases: ["rrole"],
  category: "Moderation",
  descriptions: "Remove someone role by mention or id",
  usage: "removerole <user> <role>",
  options: null,
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message, args) {
    if (!message.guild.me.hasPermission("MANAGE_ROLES" || "ADMINISTRATOR"))
      return message.channel.send(
        `I don't Have permissions \`MANAGE_ROLES\` or \`ADMINISTRATOR\``
      ).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    if (!message.guild.me.hasPermission("MANAGE_ROLES" || "ADMINISTRATOR"))
      return message.channel.send(
        `I don't Have permissions \`MANAGE_ROLES\` or \`ADMINISTRATOR\``
      ).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

    if (!message.member.hasPermission("MANAGE_ROLES" || "ADMINISTRATOR"))
      return message.channel.send("You don't have permissions for that!").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

    const needsRole =
      message.guild.member(message.mentions.users.first()) ||
      message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) ||
      message.guild.members.cache.get(args[0]);

    if (!needsRole) {
      return message.channel.send("User not found").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    }

    const role =
      message.guild.roles.cache.find(role => role.name === args.join(" ").slice(23)) ||
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args.join(" ").slice(23));

    if (!needsRole) {
      return message.channel.send("User not found").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    }

    if (!role) {
      return message.channel.send("Please input a valid role").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    }

    if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
      return message.channel.send(
        `My Highest role must be higher than **\`${role.name}\`**!`
      ).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    }

    if (message.member.roles.highest.comparePositionTo(role) < 0) {
      return message.channel.send(
        `Your role must be higher than **${role.name}** role!`
      ).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    }

    if (
      message.guild.me.roles.highest.comparePositionTo(
        needsRole.roles.highest
      ) < 0
    )
      return message.channel.send(
        `My Highest role must be higher than **\`${needsRole.user.tag}\`** highest role!`
      ).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

    try {
      var react = await message.channel.send(
        `Are you sure remove role **${role.name}** from **\`${needsRole.user.tag}\`**?`
      );
      await react.react("✅");
      await react.react("❎");
      const filter = (reaction, user) =>
        user.id !== message.client.user.id && user.id === message.author.id;
      var collector = react.createReactionCollector(filter, {time: 60000});
      collector.on("collect", (reaction, user) => {
        if (collector && !collector.ended) collector.stop();
        switch (reaction.emoji.name) {
          case "✅":
            reaction.users.remove(user).catch(console.error);
            react.edit(
              `<a:yes:765207711423004676> | removed role **${role.name}** from **\`${needsRole.user.tag}\`** successful!`
            );
            needsRole.roles.remove(role.id);
            break;

          case "❎":
            reaction.users.remove(user).catch(console.error);
            react.edit(
              `<a:no:765207855506522173> | removed role **${role.name}** from **\`${needsRole.user.tag}\`** has canceled!`
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
