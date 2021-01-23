const { createEmbed, formatMs } = require("../utils/Function");
module.exports = {
    name: 'voiceStateUpdate',
    async run(client, oldState, newState) {
        const queue = client.queue.get(newState.guild.id);
        if (!queue) return;

        const newVc = newState.channel,
            oldVc = oldState.channel,
            oldVcId = oldVc ? oldVc.id : null,
            newVcId = newVc ? newVc.id : null,
            queueVc = client.channels.cache.get(queue.voiceChannel),
            oldMember = oldState.member,
            member = newState.member,
            queueVcMember = queueVc.members.filter(x => !x.user.bot),
            newVcMember = newVc ? newVc.members.filter(x => !x.user.bot) : null,
            botId = client.user.id;

        if (member ? member.id === botId && oldVcId === queueVc.id && newVcId !== queueVc.id && newVcId !== undefined : null) {
            if (!newVcMember) return;
            if (newVcMember.size === 0 && queue.timeout === null) {
                toTimeout(newVcMember, queue, newState);
            } else if (newVcMember.size !== 0 && queue.timeout !== null) {
                resumeTimeout(newVcMember, queue, newState)
            }
            queue.voiceChannel === newVc;
        }

        if (member ? !member.user.bot && oldVcId === queueVc.id && newVcId !== queueVc && queue.timeout === null : member) toTimeout(queueVcMember, queue, newState);

        if (member ? !member.user.bot && newVcId === queueVc.id : undefined) resumeTimeout(queueVcMember, queue, newState)

        function toTimeout(vcMembers, queue, newState) {
            if (vcMembers.size !== 0) return;
            clearTimeout(queue.timeout);
            client.queue.get(newState.guild.id).timeout = null;
            client.queue.get(newState.guild.id).playing = false;
            queue.connection ? queue.connection.dispatcher.pause(true) : null;
            const timeout = 120000;
            const duration = formatMs(timeout);
            client.queue.get(newState.guild.id).timeout = setTimeout(() => {
                client.channels.cache.get(queue.voiceChannel).leave();
                client.channels.cache.get(queue.textChannel).send(
                    createEmbed("error", `⏹ | Queue Deleted because in **\`${duration}\`** no one who join my voice channel!`)
                ).then(x => { x.delete({ timeout: 10000 }) }).catch((e) => { console.log(e) })
            }, timeout);
            client.channels.cache.get(queue.textChannel).send(
                createEmbed("warn", `⏸ | Queue Paused because the voice channel is empty!.\nQueue will be deleted if in **\`${duration}\`** Nothing join the voice channel!`)
            ).then(x => { x.delete({ timeout: 10000 }) }).catch((e) => { console.log(e) })
        }

        function resumeTimeout(vcMembers, queue, newState) {
            if (vcMembers.size > 0) {
                if (queue.playing) return;
                try {
                    clearTimeout(queue.timeout);
                    client.queue.get(newState.guild.id).timeout = null;
                    client.channels.cache.get(queue.textChannel).send(
                        createEmbed("info", `▶ | Someone has joined the voice channel. Queue Resumed!`)
                    ).then(x => { x.delete({ timeout: 10000 }) }).catch((e) => {console.log(e)})
                    client.queue.get(newState.guild.id).playing = true;
                    client.queue.get(newState.guild.id).connection.dispatcher.resume(true)
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
}