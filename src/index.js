//~~~~~~~~~~~~~~~~~~~~~~~~~~PACKAGE REQUIREMENT CODE IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~\\
require('dotenv').config()
const Discord = require("discord.js");
const Munari = require('./struct/Client');
const client = new Munari({
  token: 'NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.EDydgpK7SRPYBC3fPicAmvP1eh4',
  dblapi: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0MDExMjM1MzQ4MzU1NDg1OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA1NDk5OTc3fQ.0S6h9gpQg77c0mLRqLC4vc4zgduENIBrPlXzkRtDF24',
  alexapi: '93jQYsGpTm_Jz44_fxV2VlsL9t6Uk36zfHq3buCb',
  prefix: 'm!'
});
const DBL = require('dblapi.js');
const dbl = new DBL(client.config.dblapi, client);

["command"].forEach(handler => {
  require(`./utils/${handler}`)(client);
});
//event
["events"].forEach(handler => {
  require(`./utils/${handler}`)(client);
});

process.on("unhandledRejection", e => {
  console.error(`Error handler caught an error: \n${e.stack}`);
});

process.on("uncaughtException", e => {
  console.error(`Error handler caught an error: \n${e.stack}`);
  console.info("Fatal error has been detected. Exiting processing...");

  process.exit(1);
});

client.login(client.config.token);
//~~~~~~~~~~~~~~~~~~~~~~~~~~START SERVER CODE IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~\\
client.on("ready", async () => {
  console.log("Amjay Mabar, SKUUYYY");
  setInterval(() => {
     const status = [
      `• Mention me for know my prefix •`,
      `• Ready to ${client.guilds.cache.size} Servers •`,
      `• With ${client.users.cache.size} Users •`,
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
  setInterval(() => {
    dbl.postStats(client.guilds.cache.size)
  }, 1800000)
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~COMMAND CONSOLE IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~~\\
client.on("message", async message => {
  //Prefix In Here\\
  const prefix = client.config.prefix;
  const getpref = new RegExp(`^<@!?${client.user.id}>( |)$`);
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  const newPrefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : prefix;

 const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setAuthor(`Munari Help`)
    .setThumbnail(`${client.user.avatarURL()}`)
    .setDescription(`My global prefix is **\`m!\`**\n\nUse **\`m!help\`** to get command list\n**[[INVITE ME](https://top.gg/bot/740112353483554858/invite)] [[VOTE ME](https://top.gg/bot/740112353483554858/vote)]**`)
  if (message.content.match(getpref)) return message.channel.send(embed);

  if (
    !message.content.startsWith(newPrefix) ||
    message.author.bot ||
    message.channel.type === 'dm' ||
    (message.guild !== null && !message.guild.me.hasPermission('SEND_MESSAGES')) ||
    !message.channel.permissionsFor(client.user).has('SEND_MESSAGES')
  ) return
  
  let args = message.content
    .slice(newPrefix.length)
    .trim()
    .split(/ +/g);
  let cmd = args.shift().toLowerCase();
  if(!cmd) return

  //Command Files in HERE
  let command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) return;

  //Owner Only
  if (command.ownerOnly && message.author.id !== "243728573624614912") {
    return
  }

  //GuildOwnly
  if (command.guildOnly && message.channel.type === 'dm') {
    return
  }

  //Cooldown command in here
  const cooldowns = client.cooldowns
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
  try{
    let embed = message.embeds[0];
    if (
      message.author.id === "673362753489993749" &&
      embed &&
      embed.title &&
      embed.title.includes("Tier") &&
      embed.image
    ) {
      var i = 15;
      let e = new Discord.MessageEmbed()
      var time = await message.channel.send({ embed: e.setDescription(`:green_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#78b159') })
      var interval = setInterval(function () {
        i = i - 5;
        if (i === 0) {
          clearInterval(interval)
          time.edit({ embed: e.setDescription(`:black_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#31373d') }).then(x => { x.delete({ timeout: 3000 }) })
        }
        if (i === 5) {
          time.edit({ embed: e.setDescription(`:red_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#dd2e44') })
        }
        if (i === 10) {
          time.edit({ embed: e.setDescription(`:yellow_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#fdcb58') })
        }
        if (i === 15) {
          time.edit({ embed: e.setDescription(`:green_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#78b159') })
        }
      }, 5000);
    }
  }catch (e) {
  return message.channel.send(e)
  }
});