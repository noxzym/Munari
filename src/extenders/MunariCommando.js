const { Collection } = require("discord.js");

class MunariCommandManager extends Collection {
    constructor() {
        super()
    }
};

class MunariCommandAliases extends Collection {
    constructor() {
        super()
    }
};

class MunariCommandCooldown extends Collection {
    constructor() {
        super()
    }
};

module.exports = class MunariCommando extends Collection {
    constructor() {
        super();
        this.command = new MunariCommandManager()
        this.aliases = new MunariCommandAliases();
        this.cooldown = new MunariCommandCooldown()
    }
};