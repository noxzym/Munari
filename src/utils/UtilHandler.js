const { createCanvas, loadImage } = require("canvas");
const { MessageAttachment } = require("discord.js");
const { join } = require("path");
const prettyMilliseconds = require("pretty-ms");

module.exports = class UtilHandler {
    constructor(client) {
        this.client = client;
    };

    /*Function*/
    async parseMs(value) {
        if (isNaN(value)) return;
        return prettyMilliseconds(value, { verbose: true, compact: false, secondsDecimalDigits: 0 })
    };

    async delmsg(send, msg) {
        const emo = ["🇽"];
        for (const emoji of emo) await send.react(emoji);

        var collector = send.createReactionCollector((reaction, user) => emo.includes(reaction.emoji.name) && user.id === msg.author.id);
        collector.on("collect", async (reaction) => {
            switch (reaction.emoji.name) {
                case "🇽":
                    await send.delete()
                    break;

                default:
                    break;
            }
        })
    };

    async pagination(send, page, datae, message, client) {
        const emo = ["🇽", "⏪", "⬅️", "➡️", "⏩", "⏹️"];
        for (const emoji of emo) await send.react(emoji);

        var collector = send.createReactionCollector((reaction, user) => emo.includes(reaction.emoji.name) && user.id === message.author.id);
        collector.on('collect', async (reaction, user) => {
            switch (reaction.emoji.name) {

                case "🇽":
                    await send.delete();
                    break;

                case "⏹️":
                    message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES") ? await send.reactions.removeAll() : undefined;
                    await collector.stop();
                    break;

                case "⏪":
                    message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES") ? await reaction.users.remove(user) : undefined;
                    if (page === 0) return;
                    page = datae.length - datae.length
                    send.edit(datae[page]);
                    break;

                case "⏩":
                    message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES") ? await reaction.users.remove(user) : undefined;
                    page = datae.length - 1;
                    send.edit(datae[page]);
                    break;

                case "⬅️":
                    message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES") ? await reaction.users.remove(user) : undefined;
                    if (page === 0) return
                    --page;
                    send.edit(datae[page]);
                    break;

                case "➡️":
                    message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES") ? await reaction.users.remove(user) : undefined;
                    if (page + 2 > datae.length) return
                    page++;
                    send.edit(datae[page]);
                    break;

                default:
                    break;

            }
        })
        return collector
    };

    /*ImageGeneration*/
    async brightness(img, amount) {
        const image = await loadImage(img);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i] += amount;
            imgData.data[i + 1] += amount;
            imgData.data[i + 2] += amount;
        }

        ctx.putImageData(imgData, 0, 0);

        const ath = new MessageAttachment(canvas.toBuffer(), "brightness.png")
        return ath
    };

    async darkness(img, amount) {
        const image = await loadImage(img);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i] -= amount;
            imgData.data[i + 1] -= amount;
            imgData.data[i + 2] -= amount;
        }

        ctx.putImageData(imgData, 0, 0);

        const ath = new MessageAttachment(canvas.toBuffer(), "darkness.png")
        return ath
    };

    async gay(img) {
        const image = await loadImage(img);
        const bg = await loadImage(join(__dirname, "..", "data", "images", "gay.png"));
        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        const ath = new MessageAttachment(canvas.toBuffer(), "gay.png");
        return ath
    }

    async greyscale(img) {
        const image = await loadImage(img);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imgData.data.length; i += 4) {
            const brightness = 0.34 * imgData.data[i] + 0.5 * imgData.data[i + 1] + 0.16 * imgData.data[i + 2];
            imgData.data[i] = brightness;
            imgData.data[i + 1] = brightness;
            imgData.data[i + 2] = brightness;
        };

        ctx.putImageData(imgData, 0, 0);

        const ath = new MessageAttachment(canvas.toBuffer(), "greyscale.png")
        return ath
    };

    async invert(img) {
        const image = await loadImage(img);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i] = 255 - imgData.data[i];
            imgData.data[i + 1] = 255 - imgData.data[i + 1];
            imgData.data[i + 2] = 255 - imgData.data[i + 2];
            imgData.data[i + 3] = 255;
        }

        ctx.putImageData(imgData, 0, 0);

        const ath = new MessageAttachment(canvas.toBuffer(), "invert.png")
        return ath
    };

    async sepia(img) {
        const image = await loadImage(img);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var dataArray = imageData.data;

        for (var i = 0; i < dataArray.length; i += 4) {
            var red = dataArray[i];
            var green = dataArray[i + 1];
            var blue = dataArray[i + 2];
            var alpha = dataArray[i + 3];

            var outRed = (red * .393) + (green * .769) + (blue * .189); // calculate value for red channel in pixel
            var outGreen = (red * .349) + (green * .686) + (blue * .168);
            var outBlue = (red * .272) + (green * .534) + (blue * .131);

            dataArray[i] = outRed < 255 ? outRed : 255; // check if the value is less than 255, if more set it to 255
            dataArray[i + 1] = outGreen < 255 ? outGreen : 255;
            dataArray[i + 2] = outBlue < 255 ? outBlue : 255
            dataArray[i + 3] = alpha;
        }
        ctx.putImageData(imageData, 0, 0);

        const ath = new MessageAttachment(canvas.toBuffer(), "sepia.png")
        return ath
    };

    async threshold(img, amount = 50) {
        const image = await loadImage(img);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imgData.data.length; i += 4) {
            var r = imgData.data[i];
            var g = imgData.data[i + 1];
            var b = imgData.data[i + 2];
            var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= amount) ? 255 : 0;
            imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = v
        }

        ctx.putImageData(imgData, 0, 0);

        const ath = new MessageAttachment(canvas.toBuffer(), "threshold.png")
        return ath
    };

    async circle(image) {
        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext("2d");

        ctx.save()
        ctx.beginPath()
        ctx.arc(250, 250, 250, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()

        ctx.drawImage(await loadImage(image), 0, 0, canvas.width, canvas.height)

        ctx.beginPath()
        ctx.arc(0, 0, 200, 0, Math.PI * 2, true)
        ctx.clip()
        ctx.closePath()
        return canvas.toBuffer();
    }
}