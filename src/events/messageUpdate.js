const { run } = require('./message')
module.exports = {
    name: 'messageUpdate',
    run: async function (client, oldMessage, newMessage) {
        // if ((newMessage.guild.id || oldMessage.guild.id) !== '770540956163899423') return
        if (newMessage === oldMessage) return
        if (newMessage === undefined) return

        let getfirst = newMessage.content,
            filterfirst = getfirst.split(' ')[0],
            getcmdfirst = filterfirst.replace(client.config.prefix, '')

        const commandname = client.commands.map(x => `${x.name}`)
        const commandalias = client.commands.map(x => `${x.aliases}`).filter(x => x).toString().split(',')

        if ((commandname.includes(getcmdfirst)) || (commandalias.includes(getcmdfirst))) {
            let data = newMessage.content;
            let filter = data.split(' ')[0];
            let join = data.split().join(' ');
            let getcmd = filter.replace(client.config.prefix, '');
            let cmd = client.commands.get(getcmd) || client.commands.get(client.aliases.get(getcmd));
            if (!cmd) return;
            let message = newMessage || newMessage.member.voice;
            let args = join.replace(filter, '');

            await run(client, message, args);
        }
    }
}