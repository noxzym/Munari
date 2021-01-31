const { MessageEmbed } = require("discord.js");
const { search, getInfoFromURL } = require("mal-scraper");
const { createEmbed } = require("../../utils/Function");
module.exports = {
    name: "manga",
    aliases: null,
    category: "General",
    descriptions: "Search manga by title",
    usage: "manga <title>",
    options: ["--search"],
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: null,
        userperms: null
    },
    async run(client, message, args) {
        const title = args.join(" ");
        if (!title) return message.channel.send("Please input the manga title").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        var fetchmsg = await message.channel.send(`Fetching Data <a:LoadingFetch:785715659727175731>`)

        if (message.content.includes('--search')) {
            await search.search('manga', {
                term: title.replace('--search', '')
            })
                .then(x => x.slice(0, 5))
                .then(x => {
                    searchdata(x, title.replace('--search', ''));
                });

            async function searchdata(x, get) {

                let j = 1
                let datamap = x.map((x) => `**${j++} • [${x.title}](${x.url})**`).join('\n');

                let e = createEmbed()
                    .setColor('#2e51a2')
                    .setAuthor(`MyAnimeList Search • ${get}`, 'https://cdn.discordapp.com/attachments/795512730940735508/798055553757610024/MyAnimeList_Logo.png')
                    .setDescription(datamap)
                    .setFooter(`Type 'cancel' to cancel the song request`)
                var embeds = await message.channel.send(e)
                fetchmsg.delete()

                try {
                    var response = await message.channel.awaitMessages(
                        message2 => /^(?:[1-4]|5|cancel|c)$/g.test(message2.content.toLowerCase()) && message2.author.id === message.author.id, {
                        max: 1,
                        time: 30000,
                        errors: ["time"]
                    });

                    const input = response.first().content.substr(0, 6).toLowerCase()

                    if (input === 'cancel' || input === 'c') {
                        embeds.suppressEmbeds(true).then(x => { x.edit(`<a:no:765207855506522173> | Request canceled`) })
                        return embeds.delete({ timeout: 3000 })
                    }

                    embeds.delete()
                    const dataanime = parseInt(response.first().content);
                    var getanime = await x[dataanime - 1]
                } catch (e) {
                    return message.channel.send(createEmbed("error", 'The request has canceled because no response')).then(x => x.delete({ timeout: 5000 }) && embeds.delete())
                }

                await getInfoFromURL(getanime.url).then(x => { data(x, getanime) })

                function data(x) {
                    let e = new MessageEmbed()
                        .setColor('#2e51a2')
                        .setAuthor(`MyAnimeList • ${x.title}`, 'https://cdn.discordapp.com/attachments/795512730940735508/798055553757610024/MyAnimeList_Logo.png')
                        .setURL(`${getanime.url}`)
                        .setDescription(`**Manga Informations\n\`\`\`asciidoc\n• MangaTitle    :: ${x.title}\n• JapaneseTitle :: ${x.japaneseTitle}\n• Synonyms      :: ${x.synonyms.join(", ")}\n• Genre         :: ${x.genres.join(", ")}\n• Type          :: ${x.type}\n• Episodes      :: ${x.episodes}\n• Score         :: ${x.score}\n• Status        :: ${x.status}\n• Synopsis      :: ${x.synopsis}\n\`\`\`**`)
                        .setThumbnail(`${x.picture}`)
                        .setTimestamp()
                        .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
                    message.channel.send(e)
                }
            }

        } else {
            await search.search("manga", { term: title.replace("--search", "") }).then(x => { data(x[0]) })
            fetchmsg.delete()

            async function data(x) {
                const dataget = await getInfoFromURL(x.url)
                let e = createEmbed()
                    .setColor('#2e51a2')
                    .setAuthor(`MyAnimeList • ${dataget.title}`, 'https://cdn.discordapp.com/attachments/795512730940735508/798055553757610024/MyAnimeList_Logo.png')
                    .setURL(`${x.url}`)
                    .setDescription(`**Manga Informations\n\`\`\`asciidoc\n• MangaTitle    :: ${dataget.title}\n• JapaneseTitle :: ${dataget.japaneseTitle}\n• Synonyms      :: ${dataget.synonyms.join(", ")}\n• Genre         :: ${dataget.genres.join(", ")}\n• Type          :: ${dataget.type}\n• Episodes      :: ${dataget.episodes}\n• Score         :: ${dataget.score}\n• Status        :: ${dataget.status}\n• Synopsis      :: ${dataget.synopsis}\n\`\`\`**`)
                    .setThumbnail(`${dataget.picture}`)
                    .setTimestamp()
                    .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
                return message.channel.send(e)
            }
        }
    }
};
