module.exports = {
  name: "loop",
  aliases: [""],
  category: "Music",
  descriptions: "Looping currently queue list",
  usage: "loop",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  run: async function(client, message, args) {
    try {
      const { channel } = message.member.voice;
      const botChannel = message.member.guild.me.voice.channel;

      if (channel !== botChannel) {
        return message.reply("You need to join the voice channel first!").then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
      }
      const queue = client.queue.get(message.guild.id);
      if (!queue) return message.reply("There is nothing playing.").then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);

      queue.loop = !queue.loop;
      return queue.textChannel
        .send(`<a:yes:765207711423004676> | Loop is now ${queue.loop ? `**\`On\`**` : `**\`Off\`**`}`).then(msg=>{msg.delete({timeout: 5000})})
        .catch(console.error);
    }  catch (e) {
      console.log(e)
    }
  }
};
