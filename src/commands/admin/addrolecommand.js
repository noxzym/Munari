const Discord = require("discord.js");
module.exports = {
  name: "addrole",
  aliases: null,
  category: "Moderation",
  descriptions: "Give someone role",
  usage: "addrole [user] [role]",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: ["MANAGE_ROLES"],
    userperms: ["MANAGE_ROLES"]
  },
  async run(client, message, args) {
    const needsRole =
      message.guild.member(message.mentions.users.first()) ||
      message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) ||
      message.guild.members.cache.get(args[0]);

    if (!needsRole) {
      return message.channel.send("User not found").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    }

    const role =
      message.guild.roles.cache.find(role => role.name.toLowerCase() === args.join(" ").slice(23) || role.name === args.join(" ").slice(23)) ||
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args.join(" ").slice(23));


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

    if (needsRole.roles.cache.some(r => role.id === r.id)) {
      return message.channel.send("User already has that role").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    }
    
    try {
      var react = await message.channel.send(
        `Are you sure addrole **${role.name}** to **\`${needsRole.user.tag}\`**?`
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
