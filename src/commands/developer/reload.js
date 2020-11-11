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
		if(!args.length) return
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.include(commandName));

		if(!command) return

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command **\`${command.name}\`** has been reloaded`).then(x=> {x.delete({timeout: 2000})});
		} catch(error) {
			console.error(error);
			message.channel.send(`**\`${error.message}\`**`).then(x=> {x.delete({timeout: 2000})});
		}
  }
}