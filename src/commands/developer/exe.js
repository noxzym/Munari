const { exec } = require("child_process");
module.exports = {
  name: "execute",
  aliases: ["ex"],
  category: "Developer",
  descriptions: "",
  usage: "execute <code>",
  options: [""],
  cooldown: "",
  ownerOnly: true,
  async run(client, message, args) {
    exec(args.join(" "), async (err, stdout, stderr) => { 

    if(!stderr.length){
    return message.channel.send(stdout, { code: 'bash'});
    }
    return message.channel.send(stderr, { code: 'bash'});
    });
  }
}