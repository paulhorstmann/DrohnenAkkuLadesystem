const fs = require('fs');

function setToTwoChars(num) {
    num = num + '';
    if (num.length == 1) {
        num = '0' + num;
    }
    return num;
}

Date.prototype.timestamp = function () {
    return (
        setToTwoChars(this.getDate()) +
        '.' +
        setToTwoChars(this.getMonth() + 1) +
        '.' +
        setToTwoChars(this.getFullYear()) +
        ' ' +
        setToTwoChars(this.getHours()) +
        ':' +
        setToTwoChars(this.getMinutes()) +
        ':' +
        setToTwoChars(this.getSeconds())
    );
};

function logToFile(text) {
    if (!text) {
        return;
    }
    const res = `[${new Date().timestamp()}] ${text}\n`;
    fs.appendFile('logger.log', res, (err) => {
        if (err) throw err;
    });
}

function header(text) {
    logToFile(text);
    const divider = '-'.repeat(text.length);
    console.log(`\x1b[33m${text}\x1b[0m\n${divider}`);
}

function success(text, toFile) {
    if (toFile)
        logToFile(text);
    console.log(`\x1b[32m[✔]\x1b[0m ${text}`);
}

function info(text, toFile) {
    if (toFile)
        logToFile(text);
    console.log(`\x1b[36m[i]\x1b[0m ${text}`);
}

function infoBack(text, toFile) {
    if (toFile)
        return `\x1b[36m${text}\x1b[0m`;
}

function data(title, text, toFile) {
    if (toFile)
        logToFile(text);
    console.log(`\x1b[33m${title} ➔ \x1b[0m ${text}`);
}

function error(error, toFile) {
    if (toFile)
        logToFile('!ERROR!' + error);
    console.log(`\x1b[31m[✗]\x1b[0m ${error}\n`);
}

module.exports = { header, success, info, data, error, infoBack };
