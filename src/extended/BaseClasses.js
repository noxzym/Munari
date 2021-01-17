const { Collection } = require('discord.js');

const queue = class MunariQueueManager extends Collection {
    constructor() {
        super()
    }
};

const command = class MunariCommandManager extends Collection {
    constructor() {
        super()
    }
};

const aliases = class MunariCommandAliases extends Collection {
    constructor() {
        super()
    }
};

const cooldown = class MunariCommandCooldown extends Collection {
    constructor() {
        super()
    }
};

module.exports = {
    queue,
    command,
    aliases,
    cooldown
}