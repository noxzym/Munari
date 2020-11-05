const Discord = require("discord.js-light");
module.exports = {
  name: "rate",
  category: "Actions",
  cooldown: "5",
  usage: "rate [user]",
  async run(bot, message, args) {
    let ratus =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first() ||
      message.member;
    if (ratus === bot.user.id) return;
    if (!ratus) return message.channel.send("Tag someone to rate them!");

    let rates = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    let result = Math.floor(Math.random() * rates.length);

    message.channel
      .send(`Hold a moment <a:loading1:753610786991112282>`)
      .then(msg => {
        setTimeout(function() {
          msg.edit(`${ratus} have ${result}/10 score`);
        }, 5000);
      });
    //   if(ratus.user.id === message.author.id) {
    //     const a = new Discord.MessageEmbed()
    //     .setColor('RANDOM')
    //     .setDescription(`** ${message.author}, I'd give you ${result}/10 **`)
    //     .setTimestamp()
    //     .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
    //   message.channel.send(a);
    //   }

    //   if(ratus.user.id !== message.author.id) {
    //     const b = new Discord.MessageEmbed()
    //     .setColor('RANDOM')
    //     .setDescription(`** I'd give ${ratus.user} ${result}/10 **`)
    //     .setTimestamp()
    //     .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true}))
    //     message.channel.send(b);
    //   }
  }
};
