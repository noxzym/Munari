require('dotenv').config();
require('../extenders/InlineReply');
require('../extenders/GuildMember');
require("../extenders/Guild");

const { Client } = require("discord.js");
const { Shoukaku } = require('shoukaku');
const { Api } = require('@top-gg/sdk')

const MuriNode = { name: "MuriNode", host: "MuriNode.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass' };
const MuriNode2 = { name: "MuriNode2", host: "MuriNode2.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass' };
const MuriNode3 = { name: "MuriNode3", host: "MuriNode3.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass' }
const LavalinkServer = [MuriNode, MuriNode2, MuriNode3];
const ShoukakuOptions = { moveOnDisconnect: true, resumable: false, resumableTimeout: 30, reconnectTries: 2, restTimeout: 10000 };

const MunariCommando = require('../extenders/MunariCommando');
const PlayerHandler = require('../utils/Playerhandler');
const UtilHandler = require('../utils/UtilHandler');
const ShoukakuHandler = require("../utils/ShoukakuHandler");

module.exports = class MunariClient extends Client {
    constructor(config) {
        super({
            disableMentions: "everyone",
            allowedMentions: {
                parse: []
            },
            messageCacheMaxSize: Infinity,
            messageCacheLifetime: 540,
            messageSweepInterval: 180,
            restTimeOffset: 0,
            ws: {
                intents: [
                    "GUILDS",
                    "GUILD_MEMBERS",
                    "GUILD_BANS",
                    "GUILD_EMOJIS",
                    "GUILD_INVITES",
                    "GUILD_VOICE_STATES",
                    "GUILD_PRESENCES",
                    "GUILD_MESSAGES",
                    "GUILD_MESSAGE_REACTIONS",
                    "GUILD_MESSAGE_TYPING",
                    "DIRECT_MESSAGES",
                    "DIRECT_MESSAGE_REACTIONS",
                    "DIRECT_MESSAGE_TYPING"
                ]
            }
        });
        this.commandmanager = new MunariCommando()
        this.shoukaku = new Shoukaku(this, LavalinkServer, ShoukakuOptions);
        this.lavaplayer = new ShoukakuHandler(this);
        this.player = new PlayerHandler(this)
        this.util = new UtilHandler(this)
        this.dbl = new Api('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0MDExMjM1MzQ4MzU1NDg1OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA1NDk5OTc3fQ.0S6h9gpQg77c0mLRqLC4vc4zgduENIBrPlXzkRtDF24');
        this.config = config;
        this.snipes = new Map();
    };
    async totalGuilds() {
        return this.shard.broadcastEval("this.guilds.cache.size").then(x => x.reduce((a, b) => a + b), 0)
    };
    async totalChannels() {
        return this.shard.broadcastEval("this.channels.cache.size").then(x => x.reduce((a, b) => a + b), 0)
    };
    async totalUsers() {
        return this.shard.broadcastEval("this.users.cache.size").then(x => x.reduce((a, b) => a + b), 0)
    }
    async totalPlaying() {
        return this.shard.broadcastEval("this.guilds.cache.filter(g => g.queue !== null && g.queue.playing === true).size").then(x => x.reduce((a, b) => a + b))
    };
    async totalMemory(type) {
        return this.shard.broadcastEval(`process.memoryUsage()["${type}"]`).then(x => x.reduce((a, b) => a + b))
    };
    async start() {
        this._setupShoukakuEvents()
        return super.login("NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.PNWsdNSf-fCylgj8hsSo22ZprRc")
        // return super.login("NzkxMjcxMjIzMDc3MTA5ODIw.X-MuwA.XTpdWsnWaAt3Qm7qGqkQr7zL3cM")
    };
    _setupShoukakuEvents() {
        this.shoukaku.on('ready', (name) => console.log(`Lavalink ${name}: Ready!`));
        this.shoukaku.on('error', (name, error) => console.error(`Lavalink ${name}: Error Caught,`, error));
        this.shoukaku.on('close', (name, code, reason) => console.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`));
        this.shoukaku.on('disconnected', (name, reason) => console.warn(`Lavalink ${name}: Disconnected, Reason ${reason || 'No reason'}`));
    };
};