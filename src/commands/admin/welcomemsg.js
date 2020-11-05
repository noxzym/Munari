const Discord = require("discord.js-light");
const db = require("quick.db");
const Prefix = require('discord-prefix')
module.exports = {
  name: "welcomemsg",
  aliases: ["setwelcome"],
  category: "Administration",
  descriptions: "Set welcome message by user",
  usage: "welcomemsg [description]<,.>[imageurl]",
  options: [""],
  cooldown: "",
  ownerOnly: true,
  async run(client, message, args) {
    const prefix = Prefix.getPrefix(message.guild.id) || 'm!'
    let description = args.join(" ");
    if(!description) return message.channel.send(prefix + this.usage)
    let content = description.split(",.");
    db.set(`messagewelcome_${message.guild.id}`, content[0]);
    db.set(`imagewelcome_${message.guild.id}`, content[1]);
    //set id in var

    message.channel.send(
      `Welcome Message hasbeen added. Now use setup command to enable welcome message`
    ); //send success message
  }
};
