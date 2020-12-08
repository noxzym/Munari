
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  name: "npm",
  aliases: [""],
  category: "General",
  descriptions: "GIve information about node package modules",
  usage: "npm <package>",
  options: [""],
  cooldown: "3",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {

    const query = args.join(" ");
    if (!query) { return message.channel.send("Please provide a query"); }

    const data = await fetch(`http://registry.npmjs.com/${query}`).then(i => i);
    if (!data.ok) return message.channel.send(`Owch, i got ${data.status} ${data.statusText}, maybe you typo?`);
    var fetchmsg = await message.channel.send(`Fetching Data <a:LoadingFetch:785715659727175731>`)
    const pkg = await data.json()

    let icon = 'https://images-ext-1.discordapp.net/external/-NXRfQPM329Ppw6RFeMnwDmLyqPo8Nj9gxy8vNBIuJs/https/i.imgur.com/8DKwbhj.png?width=1026&height=399'
    const embed = new MessageEmbed()
      .setColor("#cb3837")
      .setAuthor(`NPM Search Package • ${pkg.name}`, icon)
      .setThumbnail('https://images-ext-1.discordapp.net/external/-NXRfQPM329Ppw6RFeMnwDmLyqPo8Nj9gxy8vNBIuJs/https/i.imgur.com/8DKwbhj.png?width=1026&height=399')
      .setTimestamp()
      .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))

    const latest = Object.keys(pkg.versions).pop()
    const dependen = Object.keys(pkg.versions[latest].dependencies).join(', ')
    const createdAt = new Date(pkg.time.created).toLocaleDateString()
    const mod = new Date(pkg.time.modified).toLocaleDateString()
    const license = pkg.license === undefined ? "NONE" : pkg.license
    const maintainers = pkg.maintainers === undefined ? "NONE" : pkg.maintainers.map(i => i.name).join(' ,')

    embed.setDescription(pkg.description || null)
    embed.addField("Package Version", latest || null, true)
    embed.addField('CreatedAt', createdAt, true)
    embed.addField('Last Modified', mod, true)
    embed.addField('License', license, true)
    embed.addField("Maintainers", maintainers)
    embed.addField("Dependencies", `\`${dependen}\`` || null)

    const linkonly = await fetch(`http://registry.npmjs.com/-/v1/search?text=${query}&size=1`).then((res) => res.json());
    const foundPackages = linkonly.objects.map(({ package: pkg }) => pkg);

    foundPackages.forEach((pkg) => {
      const npm = pkg.links.npm === undefined ? null : pkg.links.npm
      const homepage = pkg.links.homepage === undefined ? null : pkg.links.homepage
      const reposity = pkg.links.repository === undefined ? null : pkg.links.repository
      const bugs = pkg.links.bugs === undefined ? null : pkg.links.bugs
      embed.addField("Package Link", `**[[NPM LINK](${npm})]•[[HOMEPAGE](${homepage})]•[[REPOSITORY](${reposity})]•[[BUGS](${bugs})]**`)
    });
    message.channel.send({ embed });
    fetchmsg.delete()
  },
};