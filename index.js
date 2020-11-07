const axios = require("axios")
const urls = ["https://munari.glitch.me"]
setInterval(function() {
            urls.forEach(url => {
            axios.get(url).catch(() => {});
        })
    }, 60 * 1000);
require('./src/index.js')