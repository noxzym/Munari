const { MessageEmbed } = require("discord.js");
const YoutubeAPI = require("simple-youtube-api");

let YOUTUBE_API_KEY;
try {
  YOUTUBE_API_KEY = "AIzaSyAeoZxsotVd1HdcqG8KXAIzS_O8FxQbel0";
} catch(error) {
  YOUTUBE_API_KEY = "AIzaSyD5UfUigZZoHMMT7Ec0hHIjTKiNfBQkY1E";
}
const youtube = new YoutubeAPI(YOUTUBE_API_KEY);

module.exports = {
  name: "search",
  aliases: [""],
  category: "",
  descriptions: "Search video by matching title of video",
  usage: "search <video song name>",
  options: [""],
  cooldown: "5",
  ownerOnly: true,
  guildOnly: true,
  async run(client, message, args) {
    if(message.channel.activateCollector)
      return message.reply("A message collector is already active in this channel.");
    if(!message.member.voice.channel)
      return message.reply("You need to join a voice channel first!").catch(console.error);

    const search = args.join(" ");
    if(!search) return

    let resultsEmbed = new MessageEmbed()
      .setTitle(`**Type the song number you want to play**`)
      .setColor("#3F51B5");

    try {
      const results = await youtube.searchVideos(search, 10);
      results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title.replace(/&amp;/g, '&')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&quot;/g, '"')
        .replace(/&OElig;/g, 'Œ')
        .replace(/&oelig;/g, 'œ')
        .replace(/&Scaron;/g, 'Š')
        .replace(/&scaron;/g, 'š')
        .replace(/&Yuml;/g, 'Ÿ')
        .replace(/&circ;/g, 'ˆ')
        .replace(/&tilde;/g, '˜')
        .replace(/&ndash;/g, '–')
        .replace(/&mdash;/g, '—')
        .replace(/&lsquo;/g, '‘')
        .replace(/&rsquo;/g, '’')
        .replace(/&sbquo;/g, '‚')
        .replace(/&ldquo;/g, '“')
        .replace(/&rdquo;/g, '”')
        .replace(/&bdquo;/g, '„')
        .replace(/&dagger;/g, '†')
        .replace(/&Dagger;/g, '‡')
        .replace(/&permil;/g, '‰')
        .replace(/&lsaquo;/g, '‹')
        .replace(/&rsaquo;/g, '›')
        .replace(/&euro;/g, '€')
        .replace(/&copy;/g, '©')
        .replace(/&trade;/g, '™')
        .replace(/&reg;/g, '®')
        .replace(/&nbsp;/g, ' ')
      }`));

      var resultsMessage = await message.channel.send(resultsEmbed);

      function filter(msg) {
        const pattern = /(^[1-9][0-9]{0,1}$)/g;
        return pattern.test(msg.content) && parseInt(msg.content.match(pattern)[0]) <= 10;
      }

      message.channel.activateCollector = true;
      const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
      const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;

      message.channel.activateCollector = false;
      message.client.commands.get("play").run(message, [choice]);
      resultsMessage.delete().catch(console.error);
    } catch(error) {
      console.error(error);
      message.channel.activateCollector = false;
    }
  }
}