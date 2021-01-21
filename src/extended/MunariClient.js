require('dotenv').config();
require('./InlineReply');
require('./Message');
process.setMaxListeners(0);
const { Client } = require("discord.js");
const { queue } = require('./BaseClasses')
const { Commando } = require('./MunariCommando');
const bot = require('./discordbotlist');

module.exports = class MunariClient extends Client {
    constructor(config) {
        super({
            disableMentions: "everyone",
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
        this.commandmanager = new Commando()
       
        this.queue = new queue();

        this.config = config;

        this.snipes = new Map();

        this.botlist = new bot();
    }
};
