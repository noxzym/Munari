const Discord = require("discord.js");
module.exports = {
  name: "prune",
  aliases: null,
  category: "Moderation",
  descriptions: "Delete message up to 99",
  usage: "prune <message count>",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message) {
    if (!message.member.hasPermission("ADMINISTRATOR" || "MANAGE_MESSAGES")) return message.channel.send(`You don't have permissions \`MANAGE_MESSAGES\` or \`ADMINISTRATOR\``).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

  const args = message.content.split(' ').slice(1);
  const amount = args.join(' ');
  message.delete();
    if (isNaN(amount)) return message.reply('Please input provide number').then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
    if (amount > 99) return message.reply(`I can't delete over 99 message`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
  if (amount < 1) return;
  
  await message.channel.messages.fetch({ limit: amount }).then(messages => {message.channel.bulkDelete(messages)});
}}