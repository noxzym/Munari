const { MessageEmbed } = require("discord.js");
const { getInfoFromName } = require("mal-scraper");
module.exports = {
  name: "anime",
  aliases: [""],
  category: "General",
  descriptions: "Search anime by title",
  usage: "anime <title>",
  options: [""],
  cooldown: "5",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    const title = args.join(" ");
    if (!title) return message.channel.send("Please input anime title");
    let e = new MessageEmbed().setColor(
      message.member.roles.cache.sort((a, b) => b.position - a.position).first()
        .color
    );
    await getInfoFromName(title).then(x =>
      e.setTitle(`MyAnimeList Search • ${x.title}`)
    );
    await getInfoFromName(title).then(x => e.setURL(`${x.url}`));
    await getInfoFromName(title).then(x =>
      e.setDescription(
        `**Anime Informations\n\`\`\`asciidoc\n• AnimeTitle    :: ${
          x.title
        }\n• JapaneseTitle :: ${
          x.japaneseTitle
        }\n• Synonyms      :: ${x.synonyms.join(
          ", "
        )}\n• Genre         :: ${x.genres.join(", ")}\n• Type          :: ${
          x.type
        }\n• Episodes      :: ${x.episodes}\n• Score         :: ${
          x.score
        }\n• Status        :: ${x.status}\n• Synopsis      :: ${
          x.synopsis
        }\n\`\`\`**`
      )
    );
    await getInfoFromName(title).then(x => e.setThumbnail(`${x.picture}`));
    message.channel.send({ embed: e });
  }
};
