module.exports = {
    name: 'ready',
    async run (client) {
        console.log("Amjay Mabar, SKUUYYY");
        setInterval(() => {
            const status = [
                `• Mention me for know my prefix •`,
                `• Ready to ${client.guilds.cache.size} Servers •`,
                `• With ${client.users.cache.size} Users •`,
            ];
            const type = [
                "PLAYING",
                "WATCHING",
                "LISTENING"
            ]
            let random = Math.floor(Math.random() * status.length)
            let randomtp = Math.floor(Math.random() * type.length)
            client.user.setActivity(status[random], { type: type[randomtp] });
        }, 20000);
        setInterval(() => {
            client.dbl.postStats(client.guilds.cache.size)
        }, 1800000)
    }
}