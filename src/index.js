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
const db = require("quick.db");
const PREFIX = require("discord-prefix");
const defpref = require("./data/config.json").prefix;

client.queueradio = new Map();
client.queue = new Map();
client.vote = new Map();
client.recent = new Map();

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
  // client.user.setStatus("idle");
  // client.user.setActivity(`• Mention me for know my prefix •`, {
  //   type: "WATCHING"
  // });
  setInterval(() => {
     const status = [
      `• Mention me for know my prefix •`,
      `• ${client.guilds.cache.size} Server •`,
      `• ${client.users.cache.size} Users •`
    ];
    const type = [
      "PLAYING",
      "WATCHING",
      "LISTENING"
    ]
     let random = Math.floor(Math.random() * status.length)
     let randomtp = Math.floor(Math.random() * type.length)
     client.user.setActivity(status[random], {type: type[randomtp]});
  }, 5000);
});

client.on("reconnecting", () => {
  console.log("Reconnecting!");
});

client.on("disconnect", () => {
  console.log("Disconnect!");
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~COMMAND CONSOLE IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~~\\
client.on("message", async message => {
  if (message.channel instanceof Discord.DMChannel) return;
  //Prefix In Here\\
  const prefixMention = new RegExp(`^<@!?${client.user.id}>`);

  const pref = PREFIX.getPrefix(message.guild.id);
  let prefix = {};
  if (!pref) {
    prefix = defpref; //prefix default
  } else {
    prefix = pref;
  }

  const embed = new Discord.MessageEmbed()
    .setColor("#C0FF0C")
    .setDescription(
      `${"<a:mention:761488900513464341>"} **Hai ${
        message.author
      }, My Prefix in this server is \`${prefix}\`** ${"<a:mention:761488900513464341>"}`
    );
  if (message.content.match(prefixMention)) return message.channel.send(embed);

  if (!message.content.startsWith(prefix) || message.author.bot) return null;
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
    return message.reply("Owner Only Commands");
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
          msg.delete({ timeout: cooldownAmount });
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
  const guild = db.get(`shoob-${message.guild.id}`);
  if (
    message.author.id === "673362753489993749" &&
    message.guild.id === guild &&
    embed &&
    embed.title &&
    embed.title.includes("Tier: 1") &&
    embed.image
  ) {
    const roles = message.guild.roles.cache.find(
      x => x.name.includes("Tier") && x.name.includes("1")
    ).id;
    var af = 20;
    var time = await message.channel.send(
      `**<:T1:772975158272983080> | <@&${roles}> • \`❝ ${embed.title} ❞ Despawn in ${af}\`**`
    );
    function myTimer() {
      if (af === 0) {
        clearInterval(timer);
        time.edit(
          `**<:T1:772975158272983080> | <@&${roles}> • \`❝ ${embed.title} ❞\`**`
        );
      } else {
        af = af - 2;
        time.edit(
          `**<:T1:772975158272983080> | <@&${roles}> • \`❝ ${embed.title} ❞ Despawn in ${af}\`**`
        );
      }
    }
    var timer = setInterval(function() {
      myTimer();
    }, 2000);
  }
});

client.on("message", async message => {
  let embed = message.embeds[0];
  const guild = db.get(`shoob-${message.guild.id}`);

  if (
    message.author.id === "673362753489993749" &&
    message.guild.id === guild &&
    embed &&
    embed.title &&
    embed.title.includes("Tier: 2") &&
    embed.image
  ) {
    const roles = message.guild.roles.cache.find(
      x => x.name.includes("Tier") && x.name.includes("2")
    ).id;
    var af = 20;
    var time = await message.channel.send(
      `**<:T2:772975194461175828> | <@&${roles}> • \`❝ ${embed.title} ❞ Despawn in ${af}\`**`
    );
    function myTimer() {
      if (af === 0) {
        clearInterval(timer);
        time.edit(
          `**<:T2:772975194461175828> | <@&${roles}> • \`❝ ${embed.title} ❞\`**`
        );
      } else {
        af = af - 2;
        time.edit(
          `**<:T2:772975194461175828> | <@&${roles}> • \`❝ ${embed.title} ❞ Despawn in ${af}\`**`
        );
      }
    }
    var timer = setInterval(function() {
      myTimer();
    }, 2000);
  }
});

client.on("message", async message => {
  let embed = message.embeds[0];
  const guild = db.get(`shoob-${message.guild.id}`);

  if (
    message.author.id === "673362753489993749" &&
    message.guild.id === guild &&
    embed &&
    embed.title &&
    embed.title.includes("Tier: 3") &&
    embed.image
  ) {
    const roles = message.guild.roles.cache.find(
      x => x.name.includes("Tier") && x.name.includes("3")
    ).id;
    var af = 20;
    var time = await message.channel.send(
      `**<:T3:772975229647192085> | <@&${roles}> • \`❝ ${embed.title} ❞ Despawn in ${af}\`**`
    );
    function myTimer() {
      if (af === 0) {
        clearInterval(timer);
        time.edit(
          `**<:T3:772975229647192085> | <@&${roles}> • \`❝ ${embed.title} ❞\`**`
        );
      } else {
        af = af - 2;
        time.edit(
          `**<:T3:772975229647192085> | <@&${roles}> • \`❝ ${embed.title} ❞ Despawn in ${af}\`**`
        );
      }
    }
    var timer = setInterval(function() {
      myTimer();
    }, 2000);
  }
});

client.on("message", async message => {
  let embed = message.embeds[0];
  const guild = db.get(`shoob-${message.guild.id}`);

  if (
    message.author.id === "673362753489993749" &&
    message.guild.id === guild &&
    embed &&
    embed.title &&
    embed.title.includes("Tier: 4") &&
    embed.image
  ) {
    const roles = message.guild.roles.cache.find(
      x => x.name.includes("Tier") && x.name.includes("4")
    ).id;
    var af = 20;
    var time = await message.channel.send(
      `**<:T4:772975257677987901> | <@&${roles}> • \`❝ ${embed.title} ❞ Despawn in ${af}\`**`
    );
    function myTimer() {
      if (af === 0) {
        clearInterval(timer);
        time.edit(
          `**<:T4:772975257677987901> | <@&${roles}> • \`❝ ${embed.title} ❞\`**`
        );
      } else {
        af = af - 2;
        time.edit(
          `**<:T4:772975257677987901> | <@&${roles}> • \`❝ ${embed.title} ❞ Despawn in ${af}\`**`
        );
      }
    }
    var timer = setInterval(function() {
      myTimer();
    }, 2000);
  }
});

client.on("message", async message => {
  let embed = message.embeds[0];
  const guild = db.get(`shoob-${message.guild.id}`);

  if (
    message.author.id === "673362753489993749" &&
    message.guild.id === guild &&
    embed &&
    embed.title &&
    embed.title.includes("Tier: 5") &&
    embed.image
  ) {
    const roles = message.guild.roles.cache.find(
      x => x.name.includes("Tier") && x.name.includes("5")
    ).id;
    var af = 20;
    var time = await message.channel.send(
      `**<:T5:772975287004692501> | <@&${roles}> • \`❝ ${embed.title} ❞ Despawn in ${af}\`**`
    );
    function myTimer() {
      if (af === 0) {
        clearInterval(timer);
        time.edit(
          `**<:T5:772975287004692501> | <@&${roles}> • \`❝ ${embed.title} ❞\`**`
        );
      } else {
        af = af - 2;
        time.edit(
          `**<:T5:772975287004692501> | **<@&${roles}> • \`❝ ${embed.title} ❞ Despawn in ${af}\`**`
        );
      }
    }
    var timer = setInterval(function() {
      myTimer();
    }, 2000);
  }
});

client.on("message", async message => {
  let embed = message.embeds[0];
  const guild = db.get(`shoob-${message.guild.id}`);

  if (
    message.author.id === "673362753489993749" &&
    message.guild.id === guild &&
    embed &&
    embed.title &&
    embed.title.includes("Tier: 6") &&
    embed.image
  ) {
    const roles = message.guild.roles.cache.find(
      x => x.name.includes("Tier") && x.name.includes("6")
    ).id;
    var af = 20;
    var time = await message.channel.send(
      `**<:T6:772975360689176586> | <@&${roles}> • \`❝ ${embed.title} ❞ Despawn in ${af}\`**`
    );
    function myTimer() {
      if (af === 0) {
        clearInterval(timer);
        time.edit(
          `**<:T6:772975360689176586> | <@&${roles}> • \`❝ ${embed.title} ❞\`**`
        );
      } else {
        af = af - 2;
        time.edit(
          `**<:T6:772975360689176586> | <@&${roles}> • \`❝ ${embed.title} ❞   Despawn in ${af}\`**`
        );
      }
    }
    var timer = setInterval(function() {
      myTimer();
    }, 2000);
  }
});
