const { Client, Collection } = require("discord.js");

module.exports = class extends Client {
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
        this.commands = new Collection();

        this.aliases = new Collection();

        this.cooldowns = new Collection();

        this.queue = new Map();

        this.vote = new Map();

        this.config = config;

    }
};
