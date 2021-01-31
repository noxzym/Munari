const { model, Schema } = require("mongoose")

const Blacklist = model("Blacklist", new Schema({
    UserId: String
}));

const Prefix = model("Prefix", new Schema({
    GuildId: String,
    Prefix: {
        type: String
    }
}))

module.exports = {
    Blacklist,
    Prefix
}