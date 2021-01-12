const prettyMilliseconds = require("pretty-ms");

module.exports = function formatMs(ms) {
    if (isNaN(ms)) return;
    return prettyMilliseconds(ms, {
        verbose: true,
        compact: false,
        secondsDecimalDigits: 0
    })
}