require('dotenv').config();
require('../extenders/InlineReply');
require('../extenders/GuildMember');
require("../extenders/Guild");
const { Client } = require("discord.js");
const PlayerHandler = require('../utils/Playerhandler');
const MunariCommando = require('../extenders/MunariCommando');
const { Api } = require('@top-gg/sdk')
const dbl = new Api('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0MDExMjM1MzQ4MzU1NDg1OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA1NDk5OTc3fQ.0S6h9gpQg77c0mLRqLC4vc4zgduENIBrPlXzkRtDF24');
const BOATS = require('boats.js');
const boat = new BOATS('2bo3CkMT7P6CNxx7IBQrO5haxlOsSPazT8ExCCKAvUVxzuW8bKlsJqw3JH6yDd40B39zmNIGS4uV4SgVY3w54fIaiRiA0mJkMzlNlkCFCKvxoL4mtI1ABWvRfmpnUDrj8RutB2rjA7Uv9rVp9k9wt4G9VCr');

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
        this.botlist = new MunariBotList()
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
};

class MunariBotList {
    constructor() {
        this.dbl = dbl;
        this.boat = boat;
    };
};