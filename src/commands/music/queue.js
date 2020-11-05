const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js-light");
const Prefix = require('discord-prefix')
module.exports = {
  name: "queue",
  aliases: ["q"],
  category: "Music",
  descriptions: "Display tracklist songs",
  usage: "queue",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  run: async function(client, message, args) {
    const queue = client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").then(msg=>{msg.delete({timeout: 5000})});
    const description = queue.songs.map((song, index) => `**${index + 1}. ${escapeMarkdown(`『[${song.title}](${song.url})』`)}  \`【${song.requester}】\`**`);

    let queueEmbed = new MessageEmbed()
      .setAuthor(`Youtube Client Queue`) 
      .setDescription(description)
      .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color);

    const splitDescription = splitMessage(description, {
      maxLength: 2048,
      char: "\n",
      prepend: "",
      append: ""
    });

    splitDescription.forEach(async (m) => {
      queueEmbed.setDescription(m);
      message.channel.send(queueEmbed);
    });
  }
};