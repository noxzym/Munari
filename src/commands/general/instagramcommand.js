const { MessageEmbed, MessageAttachment } = require("discord.js");
const fetch = require('node-fetch')
const { registerFont, createCanvas, loadImage } = require('canvas');
const path = require('path')
registerFont(path.join(__dirname, '..', '..', '..', 'src', 'data', 'fonts', 'nishiki.ttf'), { family: 'Sans' })

module.exports = {
  name: "instagram",
  aliases: ["insta", "ig"],
  category: "General",
  descriptions: "Display instagram information",
  usage: "instagram <username>",
  options: ["--nocanvas"],
  cooldown: "8",
  ownerOnly: false,
  guildOnly: true,
  async run(client, message, args) {
    try {
      const username = args[0];
      if (!username) return client.commandmanager.command.get('help').run(client, message, [this.name]).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

      message.channel.startTyping()

      const { results } = await fetch(`https://api.hansputera.me/instagram/${username}`).then(x => x.json())
      const data = results;

      const get = data.graphql.user;
      const fullname = get.full_name;
      const userig = get.username;
      const bio = get.biography === null ? "None" : get.biography;
      const post = get.edge_owner_to_timeline_media.count
      const follower = get.edge_followed_by.count;
      const following = get.edge_follow.count;
      const priv = get.is_private ? "Yes 🔒" : "No 🔓";
      const thm = get.profile_pic_url_hd

      if (!message.content.includes('--nocanvas')) {
        const canvas = createCanvas(1200, 1200)
        const ctx = canvas.getContext('2d')

        ctx.beginPath()
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let img2 = "https://cdn.discordapp.com/attachments/795512730940735508/796296618894426122/1609922288508.png"
        let loadimg = await loadImage(img2)
        ctx.drawImage(loadimg, 100, 195, 250, 250)

        let img3 = "https://cdn.discordapp.com/attachments/795512730940735508/796417192945909840/instagram.png"
        let loadimg2 = await loadImage(img3)
        ctx.drawImage(loadimg2, 30, 30, 80, 80)

        if (get.is_verified) {
          let img4 = "https://cdn.discordapp.com/attachments/795512730940735508/796424132186341376/736956407374544967.png"
          let loadimg3 = await loadImage(img4)
          ctx.drawImage(loadimg3, 1090, 30, 80, 80)
        }

        ctx.beginPath()
        ctx.moveTo(0, 150)
        ctx.lineTo(canvas.width, 150)
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#7e7e7e';
        ctx.stroke();

        ctx.beginPath()
        ctx.moveTo(0, 580)
        ctx.lineTo(canvas.width, 580)
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#7e7e7e';
        ctx.stroke();

        ctx.font = "bold 45px Sans";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(fullname, 100, 520);

        ctx.font = "40px Sans";
        ctx.fillStyle = "#FFFFFF";
        await wraptext(ctx, bio, canvas.width - 1100, 650, 1015, 80)

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "bold 45px Sans";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(userig, 600, 80);

        ctx.font = "bold 50px Sans";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(numberformat(post), 500, 330);

        ctx.font = "30px Sans";
        ctx.fillStyle = "#7a7a7a";
        ctx.fillText("Posts", 500, 400);

        ctx.font = "bold 50px Sans";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(numberformat(follower), 725, 330);

        ctx.font = "30px Sans";
        ctx.fillStyle = "#7a7a7a";
        ctx.fillText("Followers", 725, 400);

        ctx.font = "bold 50px Sans";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(numberformat(following), 1000, 330);

        ctx.font = "30px Sans";
        ctx.fillStyle = "#7a7a7a";
        ctx.fillText("Following", 1000, 400);

        ctx.beginPath()
        ctx.arc(225, 320, 118, 0, Math.PI * 2, true);
        ctx.closePath()
        ctx.clip()

        const av = await loadImage(thm)
        ctx.lineTo(av, 50, 50)
        ctx.drawImage(av, 105, 200, 240, 240)

        let img = canvas.toBuffer()
        const ath = new MessageAttachment(img, "instagram.png")
        message.inlineReply({ content: `**Link? https://www.instagram.com/${userig}**`, files: [ath]})
        message.channel.stopTyping()
      } else {

        let e = new MessageEmbed()
          .setColor(message.member.displayHexColor)
          .setTitle(`Instagram Account • ${fullname}`)
          .setURL(`https://www.instagram.com/${username}`)
          .setThumbnail(`${thm}`)
          .setDescription(`**Account Information\n\`\`\`asciidoc\n• Username  :: ${userig}\n• Fullname  :: ${fullname}\n• Biography :: ${bio}\n• Followers :: ${follower}\n• Following :: ${following}\n• Private   :: ${priv}\n\`\`\`**`);
        await message.channel.send(e);
        message.channel.stopTyping()

      }
    } catch (error) {
      console.log(error)
      message.channel.send("Cannot find that username or the service maintenance").then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
      message.channel.stopTyping()
    }
  }
};

function numberformat(num) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "G" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(1).replace(rx, "$1") + si[i].symbol;
}

function wraptext(ctx, text, x, y, max, height) {
  let words = text.split(' ');
  let line = '';
  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > max && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += height
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
}