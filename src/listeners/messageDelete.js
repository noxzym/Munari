const moment = require('moment')
module.exports = {
  name: 'messageDelete',
  async run(client, message) {
    if (message.author.bot || message.channel.type === 'dm') return;

    if (client.snipes.length > 10) client.snipes.pop();
    client.snipes.unshift({
      channel: message.channel.id,
      color: message.member.displayHexColor,
      content: message.content,
      author: message.author,
      image: message.attachments.first() ? message.attachments.first().proxyURL : null,
      date: moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'),
    });
    /*
    const snipes = message.client.snipes.get(message.channel.id) || [];
    snipes.unshift({
      color: message.member.displayHexColor,
      content: message.content,
      author: message.author,
      image: message.attachments.first() ? message.attachments.first().proxyURL : null,
      date: moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'),
    });
    snipes.splice(1);
    message.client.snipes.set(message.channel.id, snipes);
    setTimeout(() => {
      message.client.snipes.delete(message.channel.id)
    }, 120000)
    */
  }
}