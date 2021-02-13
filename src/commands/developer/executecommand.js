const { exec } = require("child_process");
const { createEmbed } = require("../../utils/createEmbed")

module.exports = {
  name: "execute",
  aliases: ["ex"],
  category: "Developer",
  descriptions: null,
  usage: "execute <code>",
  options: null,
  cooldown: null,
  ownerOnly: true,
  missing: {
    botperms: null,
    userperms: null
  },
  async run(client, message, args) {
    const input = await message.channel.send(`❯_ ${args.join(' ')}`)
    exec(args.join(" "), async (e, stdout, stderr) => {
      if (e) return input.edit(`\`\`\`js\n${e.message}\n\`\`\``);
      if (!stderr && !stdout) return input.edit(createEmbed("spotify", "Success without results!"))
      if (stdout) {
        const pages = await pagination(stdout, 1950);
        for (const page of pages) {
          await message.channel.send(page, { code: 'bash' })
        }
      };
      if (stderr) {
        const pages = await pagination(stderr, 1950);
        for (const page of pages) {
          await message.channel.send(page, { code: 'bash' })
        }
      }
    });

    async function pagination(text, limit) {
      const lines = text.trim().split("\n");
      const pages = [];
      let chunk = "";

      for (const line of lines) {
        if (chunk.length + line.length > limit && chunk.length > 0) {
          pages.push(chunk);
          chunk = "";
        }

        if (line.length > limit) {
          const lineChunks = line.length / limit;

          for (let i = 0; i < lineChunks; i++) {
            const start = i * limit;
            const end = start + limit;
            pages.push(line.slice(start, end));
          }
        } else {
          chunk += `${line}\n`;
        }
      }

      if (chunk.length > 0) {
        pages.push(chunk);
      }

      return pages;
    }
  }
}