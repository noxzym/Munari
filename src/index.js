//~~~~~~~~~~~~~~~~~~~~~~~~~~PACKAGE REQUIREMENT CODE IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~\\
const Discord = require("discord.js-light");
const client = new Discord.Client({
  disableMentions: "everyone",
  fetchAllMembers: true,
  cacheGuilds: true,
  cacheChannels: true,
  cacheOverwrites: true,
  cacheRoles: true,
  cacheEmojis: true,
  cachePresences: true
});
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const cooldowns = new Discord.Collection();

const { readdirSync } = require("fs");

client.queue = new Map();
client.vote = new Map();

["command"].forEach(handler => {
  require(`./utils/${handler}`)(client);
});
//event
["events"].forEach(handler => {
  require(`./utils/${handler}`)(client);
});

client.login("NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.EDydgpK7SRPYBC3fPicAmvP1eh4");
//~~~~~~~~~~~~~~~~~~~~~~~~~~START SERVER CODE IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~\\
client.on("ready", async () => {
  console.log("Amjay Mabar, SKUUYYY");
  setInterval(() => {
     const status = [
      `• Mention me for know my prefix •`,
      `• ${client.guilds.cache.size} Server •`,
      `• ${client.users.cache.size} Users •`,
      `• New Music Module!!! •`
    ];
    const type = [
      "PLAYING",
      "WATCHING",
      "LISTENING"
    ]
     let random = Math.floor(Math.random() * status.length)
     let randomtp = Math.floor(Math.random() * type.length)
     client.user.setActivity(status[random], {type: type[randomtp]});
  }, 20000);
});

client.on("reconnecting", () => {
  console.log("Reconnecting!");
});

client.on("disconnect", () => {
  console.log("Disconnect!");
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~COMMAND CONSOLE IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~~\\
client.on("message", async message => {
  //Prefix In Here\\
  const prefixMention = new RegExp(`^<@!?${client.user.id}>`);
  
  const prefix = 'm!'

  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setAuthor(`Munari Help`)
    .setThumbnail(`${client.user.avatarURL()}`)
    .setDescription(`My global prefix is **\`m!\`**\n\nIf you don't know my command,\nyou can use **\`m!help\`** to getStarted.\nFor more information about command,\nYou can use **\`m!help [commandName]\`**.\n\nIf command can't be run,\nYou can use **\`m!bug <detile problem>\`** for report to developer.`)
  if (message.content.match(prefixMention)) return message.channel.send(embed);

  if (!message.content.startsWith(prefix) || message.author.bot) return;
  let args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  let cmd = args.shift().toLowerCase();

  //Command Files in HERE

  let command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) return;

  //Owner Only
  if (command.ownerOnly && message.author.id !== "243728573624614912") {
    return
  }

  //GuildOwnly
  if(command.guildOnly && message.channel.type === 'dm') {
    return
  }

  //Cooldown command in here
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = command.cooldown * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message
        .reply(
          `please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.`
        )
        .then(msg => {
          msg.delete({ timeout: 5000 });
        });
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  if (message.member.id === "243728573624614912") {
    timestamps.delete(message.author.id, now);
  }
  //Execute command in here
  if (command)
    try {
      command.run(client, message, args);
    } catch (err) {
    } finally {
      console.log(
        `${message.author.tag} menggunakan command ${prefix}${cmd} di server ${message.guild.name} channel #${message.channel.name}`
      );
    }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~SHOOB PING IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~~\\
client.on("message", async message => {
let embed = message.embeds[0];
  if (
    message.author.id === "673362753489993749" &&
    embed &&
    embed.title &&
    embed.title.includes("Tier") &&
    embed.image
  ) {
    var i = 20;
      let e = new Discord.MessageEmbed()
      var time = await message.channel.send({embed: e.setDescription(`**\`❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#87ff00')})
      var interval = setInterval (function () {
        i = i - 5;
        if (i === 0) {
            clearInterval(interval)
            time.edit({embed: e.setDescription(`Timeout`)}).then(x => {x.delete({timeout: 3000})})
        } 
        if (i === 5) {
            time.edit({embed: e.setDescription(`**\`❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#ff0000')})
        }
            if (i === 10) {
            time.edit({embed: e.setDescription(`**\`❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#ff8300')}) 
        }
            if (i === 15) {
            time.edit({embed: e.setDescription(`**\`❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#ffff00')})
        }
            if (i === 20) {
            time.edit({embed: e.setDescription(`**\`❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#87ff00')})
        }
      }, 5000);
  }
});