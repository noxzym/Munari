const glob = require("glob");
const { readFileSync } = require("fs");
const { createEmbed } = require("../../utils/Function")

module.exports = {
    name: "totalcode",
    aliases: null,
    category: "Utility",
    descriptions: "Display totalcode of me",
    usage: "totalcode",
    options: null,
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["EMBED_LINKS"],
        userperms: null
    },
    async run(client, message, args) {
        glob("src/**/*.js", async (e, f) => {
            if (e) throw e;
            let h = i = j = k = 0;
            let l = m = "";

            let length = f.length;
            await Promise.all(f.map(x => {
                const str = readFileSync(x).toString();
                const data = str.split("\n").length
                h = h + data;
                i = i + str.length;
                if (data > j) {
                    j = data;
                    l = x.slice((x.lastIndexOf("/") - 1 >>> 0) + 2);
                };
                if (str.length > k) {
                    k = str.length;
                    m = x.slice((x.lastIndexOf("/") - 1 >>> 0) + 2)
                };
                return null;
            }));

            let muah = createEmbed("info")
                .setAuthor(`${client.user.username} • Totalcode`, client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }), "https://discord.com/oauth2/authorize?client_id=740112353483554858&scope=bot&permissions=2146827639")
                .setDescription(
                    `**\`\`\`asciidoc\n` + 
                    `• Total Files   :: ${length.toString()} Files\n` + 
                    `• Total Lines   :: ${h.toString()} Lines\n` +
                    `• Total Letter  :: ${i.toString()} Letters\n\n` +
                    `File with the Highest amount of lines is ${l.split(".")[0]}\n` +
                    `File with the Highet amount of letter is ${m.split(".")[0]}` +
                    `\n\`\`\`**`
                )
                // .setDescription(
                //     `**\`${length.toString()}\`** Files has been created with **\`${h.toString()}\`** Lines and **\`${i.toString()}\`** Letters\n` +
                //     `File with the highest amount of lines is **\`${l.split(".")[0]}\`** with **\`${j.toString()}\`** Lines\n` +
                //     `File with the highest amount of letters if **\`${m.split(".")[0]}\`** with **\`${k}\`** Letters`
                // )
                .setTimestamp()
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }));
            message.channel.send(muah)
        })
    }
}