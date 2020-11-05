const Discord = require('discord.js-light')
module.exports = {
  name: "restart",
  aliases: [""],
  category: "Developer",
  descriptions: "",
  usage: "restart",
  options: [""],
  cooldown: "",
  ownerOnly: true,
  async run(client, message, args) {
    message.channel.send(`Restarting Bot...`)
    .then(msg => {msg.delete({timeout:3000})})
      .then(client.destroy())
        .then(client.login(process.env.CLIENT_TOKEN))
          .then(client.user.setActivity(`• Mention me for know my prefix •`, {
            type: "WATCHING"
          }))
  message.delete();
//     try {
//       var react = await message.channel.send(`Are you sure Restart ${client.user.username}?`);
//       await react.react('✅');
//       await react.react('❎');
//       const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
//       var collector = react.createReactionCollector(filter);
//       collector.on('collect', (reaction, user) => {
//         if (collector && !collector.ended) collector.stop();
//         switch (reaction.emoji.name) {
//           case "✅":
//             reaction.users.remove(user).catch(console.error)
//             react.edit(`<a:yes:765207711423004676> | Restarting **${client.user.username}** successful!`)
//             .then(msg=> {msg.delete({timeout:3000})})
//             break;

//           case "❎":
//             reaction.users.remove(user).catch(console.error)
//             react.edit(`<a:no:765207855506522173> | Restarting **${client.user.username}** has canceled!`)
//             .then(msg => { msg.delete({ timeout: 3000 }) })
//             break;

//           default:
//             reaction.users.remove(user).catch(console.error)
//             break;
//         }
//       })
//       collector.on('end', () => {
//         react.reactions.removeAll().catch(console.error);
//       })
//     } catch (e) {
//       console.log(e)
//     }
}}