const { readdirSync } = require("fs");

module.exports = (client) => {
  const eventFiles = readdirSync("./src/events/").filter((file) =>
    file.endsWith(".js")
  );

  eventFiles.forEach((file) => {
    const event = require(`../events/${file}`);

    if (!event.run)
      throw new TypeError(
        `[ERROR]: execute function is required for events! (${file})`
      );

    if (!event.name)
      throw new TypeError(`[ERROR]: name is required for events! (${file})`);

    client.on(event.name, event.run.bind(null, client));

    delete require.cache[require.resolve(`../events/${file}`)];
  });
};