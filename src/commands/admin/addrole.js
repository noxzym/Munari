const Discord = require("discord.js-light");
module.exports = {
  name: "addrole",
  aliases: [""],
  category: "Administration",
  descriptions: "Give someone role",
  usage: "addrole [user] [role]",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    if (!message.guild.me.hasPermission("MANAGE_ROLES"))
      return message.channel.send(`I don't Have permissions \`MANAGE_ROLES\``);

    if (!message.member.hasPermission("MANAGE_ROLES" || "ADMINISTRATOR"))
      return message.channel.send("You don't have permissions for that!");

    const needsRole =
      message.guild.member(message.mentions.users.first()) ||
      message.guild.members.cache.get(args[0]);

    if (!needsRole) {
      return message.channel.send("User not found");
    }

    const role =
      message.guild.roles.cache.find(
        role => role.name === args.join(" ").slice(23)
      ) ||
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args.join(" ").slice(23));


    if (!role) {
      return message.channel.send("Please input a valid role");
    }

    if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
      return message.channel.send(
        `My Highest role must be higher than **\`${role.name}\`**!`
      );
    }

    if (message.member.roles.highest.comparePositionTo(role) < 0) {
      return message.channel.send(
        `Your role must be higher than **${role.name}** role!`
      );
    }

    if (
      message.guild.me.roles.highest.comparePositionTo(
        needsRole.roles.highest
      ) < 0
    )
      return message.channel.send(
        `My Highest role must be higher than **\`${needsRole.user.tag}\`** highest role!`
      );

    if (needsRole.roles.cache.some(r => role.id === r.id)) {
      return message.channel.send("User already has that role");
    }
    
    try {
      var react = await message.channel.send(
        `Are you sure addrole **${role.name}** to **\`${needsRole.user.tag}\`**?`
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
              `<a:yes:765207711423004676> | addrole **${role.name}** to **\`${needsRole.user.tag}\`** successful!`
            );
            needsRole.roles.add(role.id);
            break;

          case "❎":
            reaction.users.remove(user).catch(console.error);
            react.edit(
              `<a:no:765207855506522173> | addrole **${role.name}** to **\`${needsRole.user.tag}\`** has canceled!`
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
