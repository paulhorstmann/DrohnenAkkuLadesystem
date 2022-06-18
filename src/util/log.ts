/**
 * @author Paul Horstmann <mail@paulhorstmann.de>
 */

import * as fs from 'fs'

/**
 * Reduzier Sting oder number auf die letzen zwei Ziffer
 * @param num Zu reduzierdene Ziffern
 */
function setToTwoChars(num: number | string): string {
    let res: string = num + '';
    if (res.length == 1) {
        res = '0' + res;
    }
    return res;
}


/** 
 * Erstellt einen aktuellen Timestamp
 * @return Timestamp
 */
function timestamp(): string {
    const now = new Date
    return (
        setToTwoChars(now.getDate()) +
        '.' +
        setToTwoChars(now.getMonth() + 1) +
        '.' +
        setToTwoChars(now.getFullYear()) +
        ' ' +
        setToTwoChars(now.getHours()) +
        ':' +
        setToTwoChars(now.getMinutes()) +
        ':' +
        setToTwoChars(now.getSeconds())
    );
};

/**
 * Loggt string in logger.log
 * @param text
 */
function logToFile(text: string) {
    if (!text) {
        return;
    }
    const res = `[${timestamp()}] ${text}\n`;
    fs.appendFile(process.cwd() + 'logger.log', res, (err) => {
        if (err) throw err;
    });
}

/**
 * Loggt string in der console als Header 
 * @param text Zuloggender text im Header
 */
function header(text: string) {
    logToFile(text);
    const divider = '-'.repeat(text.length);
    console.log(`\x1b[33m${text}\x1b[0m\n${divider}`);
}

/**
 * Loggt string in der console mit dem Hinweis auf Erfolg
 * @param text Zu loggender string
 */
function success(text: string, toFile?: boolean) {
    if (toFile)
        logToFile(text);
    console.log(`\x1b[32m[✔]\x1b[0m ${text}`);
}

/**
 * Loggt string in der console mit dem Hinweis auf Erfolg
 * @param text Zu loggender string
 */
function info(text: string, toFile?: boolean) {
    if (toFile)
        logToFile(text);
    console.log(`\x1b[36m[i]\x1b[0m ${text}`);
}

function infoBack(text: string, toFile?: boolean) {
    if (toFile)
        return `\x1b[36m${text}\x1b[0m`;
}

function data(title: string, text: string, toFile?: boolean) {
    if (toFile)
        logToFile(text);
    console.log(`\x1b[33m${title} ➔ \x1b[0m ${text}`);
}

function error(error: string, toFile?: boolean) {
    if (toFile)
        logToFile('!ERROR!' + error);
    console.log(`\x1b[31m[✗]\x1b[0m ${error}`);
}



export default { header, success, info, data, error, infoBack };
