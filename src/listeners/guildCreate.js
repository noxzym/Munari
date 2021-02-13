const { createEmbed } = require("../utils/createEmbed");
// const { Prefix } = require("../struct/MongoModels")
module.exports = {
  name: "guildCreate",
  async run(client, guild) {

    // if (guild.members.cache.filter(x => !x.user.bot).size < 30) return await guild.leave()
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
    const memberbot = guild.members.cache.filter(x => x.user.bot).size
    const memberuser = guild.members.cache.filter(x => !x.user.bot).size

    const owner = guild.owner.user;

    let e = createEmbed("info")
      .setAuthor(`I Joined new Server`)
      .setDescription(
`**Server Information\n` +
`\`\`\`asciidoc\n` +
`Server Name   :: ${sname} | ${guild.id}\n` +
`Server Owner  :: ${owner.tag} | ${owner.id}\n` +
`Server region :: ${sreg}\n`+
`Member Count  :: ${ membert } Member\n`+
`              :: ${memberuser} User\n`+
`              :: ${memberbot} Bot\n` +
`\`\`\`**`
      );
    let channel = client.guilds.cache.get('770540956163899423').channels.cache.get('773487078654345226');
    channel.send(e)
  }
};
