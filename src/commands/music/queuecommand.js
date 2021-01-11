const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "queue",
  aliases: ["q"],
  category: "Music",
  descriptions: "Display queuelist of song",
  usage: "queue",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  run: async function (client, message, args) {
    const queue = client.queue.get(message.guild.id)
    if (!queue) return message.inlineReply(`Nothing are playing now`)

    const embeds = geneembed(message, queue.songs);

    let page = 0;
    var embed = await message.channel.send(embeds[page])
    console.log(embeds.length)
    await embed.react('❌');
    if (queue.songs.length > 6) await embed.react('➡️');

    var collector = embed.createReactionCollector((reaction, user) => ['⬅️', '❌', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000, errors: ['time'] });
    collector.on('collect', async reaction => {
      embed.reactions.removeAll().catch(console.error)
      switch (reaction.emoji.name) {

        case '❌':
          await embed.delete({ timeout: 3000 })
          break;

        case '⬅️':
          --page;
          embed.edit(embeds[page]);
          await embed.react('❌');
          if (page !== 0) await embed.react('⬅️');
          if (page + 1 < embeds.length) await embed.react('➡️')
          console.log(page)
          break;

        case '➡️':
          page++;
          embed.edit(embeds[page]);
          await embed.react('❌');
          if (page !== 0) await embed.react('⬅️');
          if (page + 1 < embeds.length) await embed.react('➡️')
          console.log(page)
          break;

        default:
          break;

      }
    })
    
    function geneembed(message, queue) {
      const embeds = [];
      let k = 5
      for (let i = 0; i < queue.length; i += 5) {
        const current = queue.slice(i + 1, k + 1);
        let j = i
        k += 5
        const inf = current.map((x) => `**${++j} • [${x.title}](${x.url}) \`【${x.requester.username}】\`**`).join('\n')

        let e = new MessageEmbed()
          .setColor('ff0000')
          .setAuthor("Youtube Client Queue", 'https://media.discordapp.net/attachments/743752317333143583/786185147706900490/YouTubeLogo.png?width=270&height=270')
          .setThumbnail(queue[0].thumbnail)
          .setDescription(`** • [${queue[0].title}](${queue[0].url}) \`【${queue[0].requester.username}】\` • \n\n▬▬▬▬▬▬▬▬ List of Queue ▬▬▬▬▬▬▬▬**\n${inf}`)
          .setTimestamp();

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