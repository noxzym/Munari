const Discord = require('discord.js')
module.exports = {
  name: "jpop",
  aliases: [""],
  category: "Music",
  descriptions: "Playing japanese song from Listen.moe",
  usage: "jpop",
  options: [""],
  cooldown: "",
  ownerOnly: false,
  guildOnly: true,
  run: async function(client, message, args) {
   try {
     const { channel } = message.member.voice;
     if(!channel) return message.reply(`You must to join voice channel first`).then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
     const permissions = channel.permissionsFor(message.client.user);
		  if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!').then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
		  if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!').then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
     
     const serverQueue = message.client.queue.get(message.guild.id);
      const song = {
        title:'Japanese Pop by Listen.moe',
        url:'https://listen.moe/stream'
		  };

		  if (serverQueue) {
			  return message.channel.send(`I was playing audio from Youtube or another stram Listen.Moe. Please use **\`m!leave\`** then play again`).then(msg=>{msg.delete({timeout: 5000})}).catch(console.error);
		  }
     
     const queueConstruct = {
			  textChannel: message.channel,
			  voiceChannel: channel,
			  connection: null,
			  loop: false,
			  songs: [],
			  volume: 100,
			  playing: true
		  };
     
     try {
       
       let e = new Discord.MessageEmbed()
       .setColor(message.member.roles.cache.sort((a, b) => b.position - a.position).first().color)
       .setTitle(`Listen.moe Stream Link : JPOP`)
       .setURL('https://listen.moe')
       .setThumbnail('https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png')
       .setTimestamp()
       .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({dynamic: true})) 
       var react = await message.channel.send(e)
       
     } catch (e) {
       console.log(e)
     }
     
     try {
        const connection = await channel.join()
        queueConstruct.connection = connection;
        await queueConstruct.connection.voice.setSelfDeaf(true);
        connection.play('https://listen.moe/stream', {highWaterMark : 1<<12});
      } catch (error) {
        console.error(`I could not join the voice channel: ${error}`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`I could not join the voice channel: ${error}`).then(msg=>{msg.delete({timeout: 5000})});
      }

   }  catch (e) {
     console.log(e)            
   }
  
  }
}
