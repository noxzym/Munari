const { MessageEmbed } = require("discord.js-light");

module.exports = {
  name: "bmi",
  category: 'Fun',
  cooldown: '5',
  usage:'bmi <weight> <height>',
  run(bot, message, args) {
    const weight = args[0];
    const height = args[1];
    
    if (!weight)
      return message.channel.send(`Please input your weight in kg`);

    if (!height)
      return message.channel.send("Please input your height in centimeters");

    const bmi = (weight / ((height * height) / 10000)).toFixed(2);

    const embed = new MessageEmbed()
      .setTitle(`${message.author.username}'s BMI`)
      .setColor("BLUE")
      .addField("Weight", `${weight}kg`)
      .addField("Height", `${height}cm`)
      .addField("BMI", bmi);

    message.channel.send({ embed });
  },
};