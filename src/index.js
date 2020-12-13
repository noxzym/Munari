//~~~~~~~~~~~~~~~~~~~~~~~~~~PACKAGE REQUIREMENT CODE IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~\\
require('dotenv').config()
const Discord = require("discord.js");
const Munari = require('./struct/Client');
const client = new Munari({
  token: process.env.token,
  dblapi: process.env.dblapi,
  alexapi: process.env.alexapi,
  prefix: process.env.prefix
});
const DBL = require('dblapi.js');
client.dbl = new DBL(client.config.dblapi, client);

["command"].forEach(handler => {
  require(`./utils/${handler}`)(client);
});
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