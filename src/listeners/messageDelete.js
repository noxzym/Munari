const moment = require('moment')
module.exports = {
  name: 'messageDelete',
  async run(client, message) {
    if (message.author.bot || message.channel.type === 'dm') return;

    const snipes = client.snipes.get(message.channel.id) || [];
    snipes.unshift({
      color: message.member.displayHexColor,
      content: message.content,
      author: message.author,
      image: message.attachments.first() ? message.attachments.first().proxyURL : null,
      date: moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'),
    });
    snipes.splice(5);
    client.snipes.set(message.channel.id, snipes);
  }
} 