const { createEmbed } = require("../../utils/createEmbed")

module.exports = {
    name: "reload",
    aliases: ["rld"],
    category: "Developer",
    descriptions: "Update change command",
    usage: "reload <command>",
    options: null,
    cooldown: null,
    ownerOnly: true,
    guildOnly: true,
    missing: {
        botperms: ["EMBED_LINKS"],
        userperms: null
    },
    async run(client, message, args) {
        let input = args[0]
        if (!input) return message.channel.send(createEmbed("error", "Operation Canceled. You need provided the command name")).then(x => { x.delete({ timeout: 10000 }) });

        // if (!input) {
        //     var send = await message.channel.send(createEmbed("info", `<a:loading:804201332243955734> | Realoading command...`))
        //     try {
        //         client.commandmanager.command.forEach(x => {
        //             let commandname = x.name;
        //             let commandpath = x.path;
        //             delete require.cache[require.resolve(`../../../src${commandpath.replace(".js", "")}`)]
        //             let cmd = require(`../../../src${commandpath}`);
        //             client.commandmanager.command.delete(commandname);
        //             if (cmd.init) cmd.init(client);
        //             client.commandmanager.command.set(commandname, cmd)
        //             cmd.path = `${x.path}`
        //         });
        //         return send.edit(createEmbed("spotify", `Operation Success!. Command **\`${x.name}\`** has been reloaded`)).then(x => { x.delete({ timeout: 10000 }) });
        //     } catch (e) {
        //         console.log(e)
        //         send.edit(createEmbed("error", `Operation Failed. Because: ${e}`)).then(x => { x.delete({ timeout: 10000 }) });
        //     }
        // }

        let command = client.commandmanager.command.get(input) || client.commandmanager.command.get(client.commandmanager.aliases.get(input));
        if (!command) return message.channel.send(createEmbed("error", `Operation Canceled. Can't found command with name **\`${input}\`**`)).then(x => { x.delete({ timeout: 10000 }) });

        try {
            var send = await message.channel.send(createEmbed("info", `<a:loading:804201332243955734> | Realoading command...`))
            delete require.cache[require.resolve(`../../../src${command.path.replace(".js", "")}`)];
            let cmd = require(`../../../src${command.path}`);
            await client.commandmanager.command.delete(command.name)
            if (cmd.init) cmd.init(client);
            await client.commandmanager.command.set(command.name, cmd)
            cmd.path = `${command.path}`;

            return send.edit(createEmbed("spotify", `Operation Success!. Command **\`${command.name}\`** has been reloaded`)).then(x => { x.delete({ timeout: 10000 }) });
        } catch (E) {
            console.log(E);
            send.edit(createEmbed("error", `Operation Failed. Because: ${E}`)).then(x => { x.delete({ timeout: 10000 }) });
        }
    }
}