//~~~~~~~~~~~~~~~~~~~~~~~~~~PACKAGE REQUIREMENT CODE IN HERE~~~~~~~~~~~~~~~~~~~~~~~~~\\
require('dotenv').config()
const Discord = require("discord.js");
const Munari = require('./struct/Client');
const client = new Munari({
  token: 'NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.EDydgpK7SRPYBC3fPicAmvP1eh4',
  // token: 'NzkxMjcxMjIzMDc3MTA5ODIw.X-MuwA.XTpdWsnWaAt3Qm7qGqkQr7zL3cM',
  dblapi: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0MDExMjM1MzQ4MzU1NDg1OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA1NDk5OTc3fQ.0S6h9gpQg77c0mLRqLC4vc4zgduENIBrPlXzkRtDF24',
  boatsapi: '2bo3CkMT7P6CNxx7IBQrO5haxlOsSPazT8ExCCKAvUVxzuW8bKlsJqw3JH6yDd40B39zmNIGS4uV4SgVY3w54fIaiRiA0mJkMzlNlkCFCKvxoL4mtI1ABWvRfmpnUDrj8RutB2rjA7Uv9rVp9k9wt4G9VCr',
  alexapi: '93jQYsGpTm_Jz44_fxV2VlsL9t6Uk36zfHq3buCb',
  prefix: 'm!'
});

const { Api } = require('@top-gg/sdk')
client.dbl = new Api(client.config.dblapi);

const BOATS = require('boats.js');
client.boat = new BOATS(client.config.boatsapi);

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