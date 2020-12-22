const Discord = require('discord.js')
const { readdirSync } = require("fs");

module.exports = (client) => {

    readdirSync("./src/commands/").forEach(dir => {

        const commands = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
    
            if (pull.name) {
                client.commands.set(pull.name, pull);
                // table.addRow(file, `✔️  -> command berhasil di load`);
            } else {
                console.log(file, `❎  -> command.name atau help.name tidak dapat ditemukan`);
                continue;
            } 
    
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
  
    });
}