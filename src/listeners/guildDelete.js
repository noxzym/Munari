const { createEmbed } = require("../utils/createEmbed");
// const { Prefix } = require("../struct/MongoModels")

module.exports = {
  name: "guildDelete",
  async run(client, guild) {
    // Prefix.findOneAndDelete({ GuildId: guild.id, Prefix: client.config.prefix }, async (err, data) => {
    //   if (err) throw err;
    //   return data
    // });

    // if (guild.members.cache.filter(x => !x.user.bot).size < 30) return
    const sname = guild.name
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" ");
    const sreg = guild.region
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" ");
    const sver = guild.verificationLevel
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" ");
    const membert = guild.members.cache.size;
    const memberbot = guild.members.cache.filter(x => x.user.bot).size;
    const memberuser = guild.members.cache.filter(x => !x.user.bot).size;

    const owner = guild.owner.user;

    let e = createEmbed("info")
      .setAuthor(`I Removed one Server`)
      .setDescription(
`**Server Information\n`+
`\`\`\`asciidoc\n`+
`Server Name   :: ${sname} | ${guild.id}\n`+
`Server Owner  :: ${owner.tag} | ${owner.id}\n`+
`Server region :: ${sreg}\n`+
`Member Count  :: ${membert} Member\n`+
`              :: ${memberuser} User\n`+
`              :: ${memberbot} Bot\n`+
`\`\`\`**`
      );
    let channel = client.guilds.cache
      .get("770540956163899423")
      .channels.cache.get("773487105854668801");
    channel.send(e);
  }
};
