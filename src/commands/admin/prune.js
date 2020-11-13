const Discord = require("discord.js-light");
module.exports = {
  name: "prune",
  aliases: [""],
  category: "Administration",
  descriptions: "Delete message up to 99",
  usage: "prune <message count>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message) {
  if(!message.member.hasPermission("ADMINISTRATOR" || "MANAGE_MESSAGES")) return message.channel.send(`You don't have permissions \`MANAGE_MESSAGES\` or \`ADMINISTRATOR\``);

  const args = message.content.split(' ').slice(1);
  const amount = args.join(' ');
  message.delete();
  if (isNaN(amount)) return message.reply('Please input provide number');
  if (amount > 99) return message.reply(`I can't delete over 99 message`);
  if (amount < 1) return;
  
  await message.channel.messages.fetch({ limit: amount }).then(messages => {message.channel.bulkDelete(messages)});
}}