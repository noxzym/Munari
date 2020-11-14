const Discord = require("discord.js-light");
const ms = require("ms");
module.exports = {
  name: "temporarymute",
  aliases: ["tmute"],
  category: "Administration",
  descriptions: "Make a user temporary can't send message",
  usage: "temporarymute <user> <time[s, m, h]>",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  async run(bot, message, args) {
  if(!message.member.hasPermission('MANAGE_ROLES' || 'ADMINISTRATOR')) return message.channel.send(`You don't have permissions \`MANAGE_ROLES\` or \`ADMINISTRATOR\``);

  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
  if(!tomute) return;
  let reason = args.slice(1).join(" ");
	if(!reason) reason = "No reason given";
  if(tomute.hasPermission("ADMINISTRATOR")) return message.channel.send("This member can't be muted");
    
  if (
    message.guild.me.roles.highest.comparePositionTo(tomute.roles.highest) < 0
  )
    return message.channel.send(
      `My Highest role must be higher than **\`${tomute.user.tag}\`** highest role!`
    );
    
  let muterole = message.guild.roles.cache.find(r => r.name === 'TMute');
  
  if(!muterole) {
		try {
			muterole = await message.guild.roles.create({
				data: {
					name: "TMute",
					color: "#514f48",
					permissions: []
				}
			});
		} catch (e) {
			console.log(e.stack);
		}
	}
	message.guild.channels.cache.forEach((channel) => {
		channel.updateOverwrite(muterole, {
			"SEND_MESSAGES": false,
			"ATTACH_FILES": false,
			"SEND_TTS_MESSAGES": false,
			"ADD_REACTIONS": false,
			"SPEAK": false,
			"STREAM": false
		});
	});
  
  let mutetime = args[1];
  if(!mutetime) return message.reply(`Please provide time mute`);

    if (tomute.roles.cache.some(r => muterole.id === r.id)) {
      return message.channel.send(`${tomute} Has been muted`)
    }

    try {
      var react = await message.channel.send(`Are you sure to mute **\`${tomute.user.tag}\`** for **\`${ms(ms(mutetime))}\`**?`);
      await react.react('✅');
      await react.react('❎');
      const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
      var collector = react.createReactionCollector(filter);
      collector.on('collect', (reaction, user) => {
        if (collector && !collector.ended) collector.stop();
        switch (reaction.emoji.name) {
          case "✅":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:yes:765207711423004676> | Muted **\`${tomute.user.tag}\`** for **\`${ms(ms(mutetime))}\`** successful!`)
            tomute.roles.add(muterole.id)
            break;

          case "❎":
            reaction.users.remove(user).catch(console.error)
            react.edit(`<a:no:765207855506522173> | Muted **\`${tomute.user.tag}\`** for **\`${ms(ms(mutetime))}\`**has canceled!`)
            break;

          default:
            reaction.users.remove(user).catch(console.error)
            break;
        }
      })
      collector.on('end', () => {
        react.reactions.removeAll().catch(console.error);
      })
    } catch (e) {
      console.log(e)
    }

  setTimeout(function(){
  tomute.roles.remove(muterole.id);
  const unmute = new Discord.MessageEmbed()
  .setColor('#fc0000')
  .setDescription(`**${tomute.user.tag} Has Been Unmuted!**`)
    message.channel.send(unmute).then(msg => {msg.delete({  timeout: 8000  })});
  }, ms(mutetime));
}}