const { run } = require('./message')
module.exports = {
    name: 'messageUpdate',
    /**
     * @param {client} client 
     * @param {oldMessage} oldMessage for filter command
     * @param {newMessage} newMessage for executing command
     */
    run: async function (client, oldMessage, newMessage) {
        if (oldMessage.author.bot) return;
        if (oldMessage.content === newMessage.content) return;

        const commandnameonly = client.commandmanager.command.map(x => x.name)
        const commandaliasesonly = client.commandmanager.command.map(x => x.aliases).filter(x => x !== null).toString().split(",")

        let getcmdfirst = newMessage.content.split(' ')[0].replace(client.config.prefix, "");
        let message = newMessage
        let args = newMessage.content.split(" ")[1]

        if ((commandnameonly.includes(getcmdfirst) || commandaliasesonly.includes(getcmdfirst))) {
            return await run(client, message, args).catch(e => console.log(e));
        }
    }
}