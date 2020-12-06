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
client.dbl = new DBL(client.config.dblapi, client);

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
// client.on("ready", async () => {
  
// });

//~~~~~~~~~~~~~~~~~~~~~~~~~~~COMMAND CONSOLE IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~~\\
// client.on("message", async message => {
  
// });

//~~~~~~~~~~~~~~~~~~~~~~~~~SHOOB PING IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~~\\
// client.on("message", async message => {
  
// });
