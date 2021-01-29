const Canvas = require("canvas");
const path = require("path");
const jimp = require("jimp");
const circle = require("@jimp/plugin-circle")
const configure = require('@jimp/custom');
const { MessageAttachment } = require("discord.js");
const GIFEncoder = require(`gifencoder`);

configure({ plugins: [circle] }, jimp);

const brightness = async (img, amount) => {
    const image = await Canvas.loadImage(img);
    const canvas = await Canvas.createCanvas(image.width, image.height);
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

const darkness = async (img, amount) => {
    const image = await Canvas.loadImage(img);
    const canvas = await Canvas.createCanvas(image.width, image.height);
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

const greyscale = async (img) => {
    const image = await Canvas.loadImage(img);
    const canvas = await Canvas.createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < imgData.data.length; i += 4) {
        const brightness = 0.34 * imgData.data[i] + 0.5 * imgData.data[i + 1] + 0.16 * imgData.data[i + 2];
        imgData.data[i] = brightness;
        imgData.data[i + 1] = brightness;
        imgData.data[i + 2] = brightness;
    }

    ctx.putImageData(imgData, 0, 0);

    const ath = new MessageAttachment(canvas.toBuffer(), "greyscale.png")
    return ath
};

const invert = async (img) => {
    const image = await Canvas.loadImage(img);
    const canvas = await Canvas.createCanvas(image.width, image.height);
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

const sepia = async (img) => {
    const image = await Canvas.loadImage(img);
    const canvas = await Canvas.createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = imgData.data[i] * 0.393 + imgData.data[i + 1] * 0.769 + imgData.data[i + 2] * 0.189;
        imgData.data[i + 1] = imgData.data[i] * 0.349 + imgData.data[i + 1] * 0.686 + imgData.data[i + 2] * 0.168;
        imgData.data[i + 2] = imgData.data[i] * 0.272 + imgData.data[i + 1] * 0.534 + imgData.data[i + 2] * 0.131;
    }

    ctx.putImageData(imgData, 0, 0);

    const ath = new MessageAttachment(canvas.toBuffer(), "sepia.png")
    return ath
};

const treshold = async (img, amount = 50) => {
    const image = await Canvas.loadImage(img);
    const canvas = await Canvas.createCanvas(image.width, image.height);
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

const Circle = async(image) => {
    image = await jimp.read(image);
    image.circle();
    let raw = await image.getBufferAsync("image/png");
    return raw;
}

module.exports = {
    brightness,
    darkness,
    greyscale,
    invert,
    sepia,
    treshold,
    Circle
}