module.exports = {
  name: "remove",
  aliases: null,
  category: "Music",
  descriptions: "Remove song from queue",
  usage: "remove <song number>",
  options: null,
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  run: async function (client, message, args) {
      const { channel } = message.member.voice;
      const botChannel = message.member.guild.me.voice.channel;

      if (channel !== botChannel) {
        return message.inlineReply("You need to join the voice channel first!").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);
      }
      const queue = client.queue.get(message.guild.id);
      if (!queue) return message.inlineReply("There is nothing playing.").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error);

    const count = args.join(' ');
    if (!count) return client.commandmanager.command.get('help').run(client, message, [this.name])
    
    if (isNaN(count)) return;
    if (count < 1 || count > queue.songs.length - 1) return;
    try {

      const song = queue.songs.splice(count, 1);
      client.channels.cache.get(queue.textChannel).send(`<a:yes:765207711423004676> | Remove ${song[0].title} from queue Successful!`).then(msg => { msg.delete({ timeout: 5000 }) });

    } catch (e) {
      console.log(e)
    }
  }
};