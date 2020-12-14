const Discord = require('discord.js')
module.exports = {
  name: 'messageDelete',
  async run(client, message) {
    if (message.author.bot) return;
    const snipes = message.client.snipes.get(message.channel.id) || [];
    snipes.unshift({
      color: message.member.displayHexColor,
      content: message.content,
      author: message.author,
      image: message.attachments.first() ? message.attachments.first().proxyURL : null,
      date: new Date().toLocaleTimeString(),
    });
    snipes.splice(1);
    message.client.snipes.set(message.channel.id, snipes);
  }
}