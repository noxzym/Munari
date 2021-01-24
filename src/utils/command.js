const { readdirSync } = require("fs");

module.exports = (client) => {

    readdirSync("./src/commands/").forEach(dir => {

        const commands = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            pull.path = `./commands/${dir}/${file}`
    
            if (pull.name) {
                client.commandmanager.command.set(pull.name, pull);
                // table.addRow(file, `✔️  -> command berhasil di load`);
            } else {
                console.log(file, `❎  -> command.name atau help.name tidak dapat ditemukan`);
                continue;
            } 
    
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.commandmanager.aliases.set(alias, pull.name));
        }
  
    });
}