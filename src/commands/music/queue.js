const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js-light");
module.exports = {
  name: "queue",
  aliases: ["q"],
  category: "Music",
  descriptions: "Display tracklist songs",
  usage: "queue",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  run: async function(client, message, args) {
  try {
      const serverQueue = message.client.queue.get(message.guild.id);
      if (!serverQueue) return message.channel.send("There is nothing playing").then(msg=>{msg.delete({timeout: 5000})});
        let page = 0;
            const embeds = geneembed(message, serverQueue.songs);
            let e = new MessageEmbed()
            const qEmbed = await message.channel.send(embeds[page])
            await qEmbed.react("⬅️");
            await qEmbed.react("❎");
            await qEmbed.react("➡️");
            const filter = (reaction, user) => user.id !== message.client.user.id;
            var collector = qEmbed.createReactionCollector(filter, {time: 20000});

              collector.on("collect", (reaction, user) => {

              switch (reaction.emoji.name) {
                case "⬅️":
                    reaction.users.remove(user).catch(console.error);
                    if (page !== 0) {
                    --page;
                    qEmbed.edit(embeds[page]);
                  }
                  break;

                case "❎":
                  reaction.users.remove(user).catch(console.error);
                  collector.stop()
                  break;

                case "➡️":
                    reaction.users.remove(user).catch(console.error);
                    if (page < embeds.length - 1) {
                      page++;
                      qEmbed.edit(embeds[page]);
                    } 
                    break;

                  default:
                    reaction.users.remove(user).catch(console.error);
                    break;
                }
                })
        } catch (e) {
          console.log(e)
        }
  }
};

function geneembed(message, queue) {
  const embeds = [];
  let page = 0;
    let k = 5;
    for (let i = 0; i < queue.length; i += 5) {
      const current = queue.slice(i, k);
      let j = i;
      k += 5;
      const info = current.map((song) => `**${++j} • 『[${song.title}](${song.url})』 \`【${song.requester}】\`**`).join("\n");
      const e = new MessageEmbed()
      .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
      .setAuthor("Youtube Client Queue")
      .setThumbnail(queue[0].thumbnail)
      .setDescription(`** • 『[${queue[0].title}](${queue[0].url})』 \`【${queue[0].requester}】\` • \n\n▬▬▬▬▬▬▬▬ List of Queue ▬▬▬▬▬▬▬▬**\n${info}`)
      // .setFooter(`Page: ${embeds.length + 1}`)
      .setTimestamp();
      embeds.push(e);
    }
    return embeds;
 }