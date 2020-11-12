const db = require("quick.db");
module.exports = {
  name: "setup",
  aliases: ["set"],
  category: "Administration",
  descriptions: "",
  usage: "setup <options>",
  options: ["welcome", "shoob"],
  cooldown: "",
  ownerOnly: false,
  async run(client, message, args) {
    if(message.content.includes("shoob")) {
      if(message.content.includes("enable")) {
        if (!message.guild.me.hasPermission("MANAGE_ROLES"))
        return message.channel.send(
          `Please give me permission to **\`MANAGE_ROLES\`**`
        );
      let t1 = message.guild.roles.cache.find(
        x => x.name.includes("Tier") && x.name.includes("1")
      );
      if (!t1) {
        try {
          t1 = await message.guild.roles.create({
            data: {
              name: "Tier 1",
              color: "#f8f8f9",
              permissions: []
            }
          });
        } catch (e) {}
      }
      let t2 = message.guild.roles.cache.find(
        x => x.name.includes("Tier") && x.name.includes("2")
      );
      if (!t2) {
        try {
          t2 = await message.guild.roles.create({
            data: {
              name: "Tier 2",
              color: "#49ca75",
              permissions: []
            }
          });
        } catch (e) {}
      }
      let t3 = message.guild.roles.cache.find(
        x => x.name.includes("Tier") && x.name.includes("3")
      );
      if (!t3) {
        try {
          t3 = await message.guild.roles.create({
            data: {
              name: "Tier 3",
              color: "#4b93d5",
              permissions: []
            }
          });
        } catch (e) {}
      }
      let t4 = message.guild.roles.cache.find(
        x => x.name.includes("Tier") && x.name.includes("4")
      );
      if (!t4) {
        try {
          t4 = await message.guild.roles.create({
            data: {
              name: "Tier 4",
              color: "#ad58e3",
              permissions: []
            }
          });
        } catch (e) {}
      }
      let t5 = message.guild.roles.cache.find(
        x => x.name.includes("Tier") && x.name.includes("5")
      );
      if (!t5) {
        try {
          t5 = await message.guild.roles.create({
            data: {
              name: "Tier 5",
              color: "#f1c40f",
              permissions: []
            }
          });
        } catch (e) {}
      }
      let t6 = message.guild.roles.cache.find(
        x => x.name.includes("Tier") && x.name.includes("6")
      );
      if (!t6) {
        try {
          t6 = await message.guild.roles.create({
            data: {
              name: "Tier 6",
              color: "#e74c3c",
              permissions: []
            }
          });
        } catch (e) {}
      }
      db.set(`shoob-${message.guild.id}`, message.guild.id)
      message.channel.send(`Shoob setup has been created`)
      }
      if(message.content.includes("disable")) {
        db.delete(`shoob-${message.guild.id}`)
        message.channel.send(`Shoob setup has been deleted`)
      }
    }
  }
};
