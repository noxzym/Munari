const { readdirSync } = require("fs");

module.exports = {
  name: "restart",
  aliases: null,
  category: "Developer",
  descriptions: "",
  usage: "restart",
  options: null,
  cooldown: "",
  ownerOnly: true,
  async run(client, message, args) {
    process.exit(1)
  }
} 