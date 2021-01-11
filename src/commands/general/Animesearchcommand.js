const { MessageEmbed } = require("discord.js");
const { getInfoFromName, search } = require("mal-scraper");
module.exports = {
  name: "anime",
  aliases: [""],
  category: "General",
  descriptions: "Search anime by title",
  usage: "anime <title>",
  options: ["--search"],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const title = args.join(" ");
    if (!title) return message.channel.send("Please input anime title");
    var fetchmsg = await message.channel.send(`Fetching Data <a:LoadingFetch:785715659727175731>`)

    if (message.content.includes('--search')) {
      await search.search('anime', {
        term: title.replace('--search', '')
      })
        .then(x => x.slice(0, 5))
        .then(x => {
          searchdata(x, title.replace('--search', ''));
        });

      async function searchdata(x, get) {

        let j = 1
        let datamap = x.map((x) => `**${j++} • [${x.title}](${x.url})**`).join('\n');

        let e = new MessageEmbed()
          .setColor('#2e51a2')
          .setAuthor(`MyAnimeList Search • ${get}`, 'https://cdn.discordapp.com/attachments/795512730940735508/798055553757610024/MyAnimeList_Logo.png')
          .setDescription(datamap)
          .setFooter(`Type 'cancel' to cancel the song request`)
        var embeds = await message.channel.send(e)

        try {
          var response = await message.channel.awaitMessages(
            message2 => /^(?:[1-4]|5|cancel|c)$/g.test(message2.content.toLowerCase()) && message2.author.id === message.author.id, {
            max: 1,
            time: 30000,
            errors: ["time"]
          });

          const input = response.first().content.substr(0, 6).toLowerCase()

          if (input === 'cancel' || input === 'c') {
            fetchmsg.delete()
            return embeds.suppressEmbeds(true).then(x => { x.edit(`<a:no:765207855506522173> | Request canceled`) }).then(() => { embeds.delete({ timeout: 3000 }) })
          }

          embeds.delete()
          const dataanime = parseInt(response.first().content);
          var getanime = await x[dataanime - 1]
        } catch (e) {
          return message.channel.send({
            embed: {
              color: "RED",
              description: 'The request has canceled because no response'
            }
          }).then(x => x.delete({ timeout: 5000 }) && embeds.delete())
        }

        await getInfoFromName(getanime.title).then(x => {
          message.channel.send(data(x))
        })

        function data(x) {
          let e = new MessageEmbed()
            .setColor('#2e51a2')
            .setAuthor(`MyAnimeList • ${x.title}`, 'https://cdn.discordapp.com/attachments/795512730940735508/798055553757610024/MyAnimeList_Logo.png')
            .setURL(`${x.url}`)
            .setDescription(`**Anime Informations\n\`\`\`asciidoc\n• AnimeTitle    :: ${x.title}\n• JapaneseTitle :: ${x.japaneseTitle}\n• Synonyms      :: ${x.synonyms.join(", ")}\n• Genre         :: ${x.genres.join(", ")}\n• Type          :: ${x.type}\n• Episodes      :: ${x.episodes}\n• Score         :: ${x.score}\n• Status        :: ${x.status}\n• Synopsis      :: ${x.synopsis}\n\`\`\`**`)
            .setThumbnail(`${x.picture}`)
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
          return e
        }
      }

      fetchmsg.delete()
    } else {

      await getInfoFromName(title.replace('--search', '')).then(x => {
        message.channel.send(data(x))
      });
      fetchmsg.delete()

      function data(x) {
        let e = new MessageEmbed()
          .setColor('#2e51a2')
          .setAuthor(`MyAnimeList • ${x.title}`, 'https://cdn.discordapp.com/attachments/795512730940735508/798055553757610024/MyAnimeList_Logo.png')
          .setURL(`${x.url}`)
          .setDescription(`**Anime Informations\n\`\`\`asciidoc\n• AnimeTitle    :: ${x.title}\n• JapaneseTitle :: ${x.japaneseTitle}\n• Synonyms      :: ${x.synonyms.join(", ")}\n• Genre         :: ${x.genres.join(", ")}\n• Type          :: ${x.type}\n• Episodes      :: ${x.episodes}\n• Score         :: ${x.score}\n• Status        :: ${x.status}\n• Synopsis      :: ${x.synopsis}\n\`\`\`**`)
          .setThumbnail(`${x.picture}`)
          .setTimestamp()
          .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
        return e
      }
    }
  }
};
