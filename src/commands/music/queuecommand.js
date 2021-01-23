const { createEmbed, formatMs, pagination } = require("../../utils/Function");
module.exports = {
  name: "queue",
  aliases: ["q"],
  category: "Music",
  descriptions: "Display queuelist of song",
  usage: "queue",
  options: null,
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  run: async function (client, message, args) {
    const queue = client.queue.get(message.guild.id)
    if (!queue) return message.inlineReply(`Nothing are playing now`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

    const embeds = geneembed(message, queue.songs);

    let page = 0;
    var embed = await message.channel.send(embeds[page])
    pagination(embed, page, embeds, message, queue)
    
    function geneembed(message, queue) {
      const embeds = [];
      const track = queue.slice(1).length;
      const estimate = formatMs(eval(queue.slice(1).map(x => x.nowplaying).filter(x => x !== undefined).join('+'))* 1000);
      let k = 5
      for (let i = 0; i < queue.length; i += 5) {
        const current = queue.slice(i + 1, k + 1);
        let j = i
        k += 5
        const inf = current.map((x) => `**${++j} • [${x.title}](${x.url}) \`【${x.requester.username}】\`**`).join('\n')

        let e = createEmbed("yt")
          .setAuthor("Youtube Client Queue", 'https://media.discordapp.net/attachments/743752317333143583/786185147706900490/YouTubeLogo.png?width=270&height=270')
          .setThumbnail(queue[0].thumbnail)
          .setDescription(`** • [${queue[0].title}](${queue[0].url}) \`【${queue[0].requester.username}】\` • \n\n▬▬▬▬▬▬▬▬ List of Queue ▬▬▬▬▬▬▬▬**\n${inf}`)
          .setTimestamp();

        queue.slice(1).length === 0 ? e.setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true })) : e.setFooter(`Total ${track} songs in ${estimate}`, message.author.avatarURL({ dynamic: true }))

        if (queue.length === 1) {
          e.setDescription(
            `** • [${queue[0].title}](${queue[0].url}) \`【${queue[0].requester.username}】\` • \n\n▬▬▬▬▬▬▬▬ List of Queue ▬▬▬▬▬▬▬▬**\nNo song in here? use **\`m!play <song[title/url]>\`**`
          )
        }
        embeds.push(e)
      }
      return embeds;
    }
  }
}