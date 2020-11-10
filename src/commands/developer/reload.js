module.exports = {
  name: "reload",
  aliases: [""],
  category: "Developer",
  descriptions: "reload command",
  usage: "reload <commandname>",
  options: [""],
  cooldown: "",
  ownerOnly: true,
  async run(client, message, args) {
	// delete message
	if (message.deletable) message.delete();
	// checks to make sure command exists
	const commandName = args[0].toLowerCase();
	if (client.commands.has(commandName)) {
		// Finds command
		const command = client.commands.get(commandName);
		// reloads command
		try {
			delete require.cache[require.resolve(`../${command.category}/${commandName}.js`)];
			client.commands.delete(commandName);
			const pull = require(`../${command.category}/${commandName}.js`);
			client.commands.set(commandName, pull);
		} catch(err) {
			return message.channel.send({ embed:{ color:15158332, description:` Could not reload: \`${commandName}\`.` } }).then(m => m.delete({ timeout: 10000 }));
		}
	} else {
		return message.channel.send({ embed:{ color:15158332, description:`\`${commandName}\` isn't a command.` } }).then(m => m.delete({ timeout: 10000 }));
	}
	message.channel.send({ embed:{ color:3066993, description:` Command: \`${commandName}\` has been reloaded.` } }).then(m => m.delete({ timeout: 8000 }));
	client.logger.log(`Reloaded Command: ${commandName}.js`);
  }
}