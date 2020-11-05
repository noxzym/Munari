
const { MessageEmbed } = require("discord.js-light");
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
  async run(client, message, args) {
    
    const query = args.join(" ");
    if (!query) { return message.channel.send("Please provide a query"); }

    const data = await fetch(`http://registry.npmjs.com/${query}`).then(i => i);
    if (!data.ok) return message.channel.send(`Owch, Saya mendapatkan error ${data.status} ${data.statusText}, Silahkan periksa ejaannya`);
    const pkg = await data.json()

    let icon = 'https://images-ext-1.discordapp.net/external/-NXRfQPM329Ppw6RFeMnwDmLyqPo8Nj9gxy8vNBIuJs/https/i.imgur.com/8DKwbhj.png?width=1026&height=399'
    const embed = new MessageEmbed()
        .setColor("#cb3837")
        .setAuthor(`NPM Search Package • ${pkg.name}`, icon)
        .setThumbnail('https://images-ext-1.discordapp.net/external/-NXRfQPM329Ppw6RFeMnwDmLyqPo8Nj9gxy8vNBIuJs/https/i.imgur.com/8DKwbhj.png?width=1026&height=399')
        .setTimestamp()
        .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))

        const latest = Object.keys(pkg.versions).pop()
        const dependen = Object.keys(pkg.versions[latest].dependencies).join(', ')

        const npm = 'https://npmjs.com/package/'+pkg['_id'] || null
        
        const homepage = pkg.homepage || null
        const reposity = pkg.repository.url || null
        const bugs = pkg.bugs.url || null

        embed.setDescription(pkg.description || null)
        // embed.addField("Package Name", pkg.name || null, true);
        // embed.addField("Package Author", pkg.author.name, true)
        embed.addField("Package Version", latest || null, true)
        embed.addField('CreatedAt', new Date(pkg.time.created).toLocaleDateString(), true)
        embed.addField('Last Modified', new Date(pkg.time.modified).toLocaleDateString(), true)
        embed.addField('License', pkg.license, true)
        embed.addField("Maintainers", pkg.maintainers.map(i => i.name).join(', ') || null)
        embed.addField("Dependencies", `\`${dependen}\`` || null)

    const linkonly = await fetch(`http://registry.npmjs.com/-/v1/search?text=${query}&size=1`).then((res) => res.json());
    const foundPackages = linkonly.objects.map(({ package: pkg }) => pkg);

    foundPackages.forEach((pkg) => {const npm = pkg.links.npm || null
        const homepage = pkg.links.homepage || null
        const reposity = pkg.links.repository || null
        const bugs = pkg.links.bugs || null
        embed.addField("Package Link", `**[[NPM LINK](${npm})]•[[HOMEPAGE](${homepage})]•[[REPOSITORY](${reposity})]•[[BUGS](${bugs})]**`)
    });


    message.channel.send({ embed });
    
  },
};