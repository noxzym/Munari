require('dotenv').config();
require('../extenders/InlineReply');
require('../extenders/GuildMember');
require("../extenders/Guild");

const { Client } = require("discord.js");
const { Api } = require('@top-gg/sdk')
const MunariCommando = require('../extenders/MunariCommando');
const PlayerHandler = require('../utils/Playerhandler');
const UtilHandler = require('../utils/UtilHandler');

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
        this.player = new PlayerHandler(this)
        this.util = new UtilHandler(this)
        this.dbl = new Api('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0MDExMjM1MzQ4MzU1NDg1OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA1NDk5OTc3fQ.0S6h9gpQg77c0mLRqLC4vc4zgduENIBrPlXzkRtDF24');
        this.config = config;
        this.snipes = new Map();
    }
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
        return this.login("NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.BZkIVivPrGsCf7E5gk4X8wBIXgM")
        // return this.login("NzkxMjcxMjIzMDc3MTA5ODIw.X-MuwA.XTpdWsnWaAt3Qm7qGqkQr7zL3cM")
    }
};