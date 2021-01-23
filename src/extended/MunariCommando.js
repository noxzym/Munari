const { Collection } = require("discord.js");
const { command, aliases, cooldown } = require("./BaseClasses");

const Commando = class MunariCommando extends Collection {
    constructor() {
        super();
        this.command = new command()
        this.aliases = new aliases();
        this.cooldown = new cooldown()
    }
};

module.exports = {
    Commando
}