const { createEmbed } = require("../../utils/createEmbed");
const fetch = require("node-fetch");
const moment = require("moment")

module.exports = {
  name: "npm",
  aliases: null,
  category: "General",
  descriptions: "GIve information about node package modules",
  usage: "npm <package>",
  options: null,
  cooldown: "3",
  ownerOnly: false,
  guildOnly: true,
  missing: {
    botperms: ["EMBED_LINKS"],
    userperms: null
  },
  async run(client, message, args) {

    const query = args.join("+");
    if (!query) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. No query given")).then(x => { x.delete({ timeout: 10000 }) });

    const { objects } = await fetch(`https://registry.npmjs.org/-/v1/search?text=${query}`).then(x => x.json());
    if (objects.length === 0) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Data not found")).then(x => { x.delete({ timeout: 10000 }) });
    const data = await objects.map(x => x.package)[0]

    const name = data.name ? `**\`${data.name}\`**` : "**\`No-Name\`**";
    const version = data.version ? `**\`V${data.version}\`**` : "**\`No-Ver\`**";
    const description = data.description ? data.description : "**\`No-Desc\`**";
    const npm = data.links.npm ? data.links.npm : null;
    const homepage = data.links.homepage ? `[[\`HOMEPAGE\`](${data.links.homepage})]` : `**\`-\`**`;
    const repository = data.links.repository ? `[[\`REPOSITORY\`](${data.links.repository})]` : `**\`-\`**`;
    const bugs = data.links.bugs ? `[[\`BUGS\`](${data.links.bugs})]` : `**\`-\`**`;
    const author = data.author ? `**\`${data.author.name}\`**` : "**\`Unknown\`**";
    const maintainers = data.maintainers ? data.maintainers.map(x => `**\`${x.username}\`**`).join(" ") : "**\`Unknown\`**";

    const pkg = await fetch(`http://registry.npmjs.com/${data.name}`).then(x => x.json());
    const created = pkg.time ? `**\`${moment(pkg.time.created).format("MMMM Do YYYY")}\`**` : "**\`Unknown\`**";
    const modified = pkg.time ? `**\`${moment(pkg.time.modified).format("MMM Do YYYY")}\`**` : "**\`Unknown\`**";
    const license = pkg.license ? `**\`${pkg.license}\`**` : "**\`Unknown\`**";
    const dependencies = pkg.versions[data.version].dependencies ? Array.from(Object.keys(pkg.versions[data.version].dependencies)).map(x => `**\`${x}\`**`).join(" ") : `**\`-\`**`;

    let e = createEmbed()
      .setColor("cb3837")
      .setAuthor(`NPM Search • ${name.replace(/\*|`/g, "")}`, 'https://images-ext-2.discordapp.net/external/3Cuh51nny9guvBRgO7FlskPbsaBIoZRbm4toUA9ba7U/https/i.imgur.com/ErKf5Y0.png', npm)
      .setDescription(`${description}\n`)
      .addField("• Name", `${name}`, true)
      .addField("• Latest", `${version}`, true)
      .addField("• Author", `${author}`, true)
      .addField("• Created", `${created}`, true)
      .addField("• Modified", `${modified}`, true)
      .addField("• License", `${license}`, true)
      .addField("• Maintainers", `${maintainers}`)
      .addField("• Dependencies", `${dependencies}`)
      .addField("• Links", `**[[\`NPM\`](${npm})] • ${homepage} • ${repository} • ${bugs}**`)
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))
    message.channel.send(e)
  },
};