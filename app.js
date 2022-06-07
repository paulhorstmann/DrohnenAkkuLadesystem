const axios = require('axios');
const dotenv = require('dotenv');
const log = require('./util/log');

const schedule = require('node-schedule');

const fs = require('fs')
const util = require('util');

const readFile = util.promisify(fs.readFile);

let activeCharge = false

dotenv.config({
    path: './config/.env',
});

const diveraURI = process.env.DIVETAURI;
const diveraAccessKey = process.env.DIVERAAPIKEY;

process.stdin.resume();

/* 
    # Init 
*/

checkLastAlarm()

const scheduleDiveraCall = schedule.scheduleJob('*/1 * * * *', () => {
    console.log(new Date);
    checkLastAlarm()
});

/* 
    # Exit Handler 
*/

function exitHandler() {
    console.log("Clear Exit")
    scheduleDiveraCall.cancel()
    callShellyAPI(false)
}

process.on('exit', exitHandler.bind(null, { cleanup: true }));

process.on('SIGINT', exitHandler.bind(null, { exit: true }));

process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

/* 
    # Check if ther is a new Alarm
*/

async function checkLastAlarm() {
    const callResult = await callDivera();

    if (callResult.success == true && callResult.data.group && callResult.data.id) {
        if (!(await isCacheOutdated(callResult.data))) {
            chargeBatteries(1000 * 10) //one hour
        }
    } else {
        log.info('No Alarm detectet')
        return false
    }

    cachAlarm = {
        id: callResult.data.id,
        group: callResult.data.group
    }

    fs.writeFile('./lastAlarm.json', JSON.stringify(cachAlarm), err => {
        if (err) {
            console.error(err)
            return true
        }
    })
}

async function isCacheOutdated(nextData) {
    let lastCache = await readFile('./lastAlarm.json', 'utf8')

    if (!lastCache) {
        return false
    }

    lastCache = JSON.parse(lastCache)

    if (nextData.id == lastCache.id) {
        log.info("ID is cached -> No Charge")
        return true;
    }
    return false
}

/* 
    ## Handle Divera
*/

async function callDivera() {
    let requestResult = 'Error';

    const callURI = diveraURI + '/api/last-alarm?accesskey=' + diveraAccessKey;
    log.data('Call', callURI);

    if (!(callURI.includes('last-alarm'))) throw 'Wrong API Endpoint';

    await axios
        .get(callURI)
        .then((response) => {
            requestResult = response.data;
            log.success('API-Call was successful');
        })
        .catch((e) => {
            log.error(e.name + ': ' + e.message, true);
        });

    return requestResult;
}


/* 
    ## Charge Batteries
*/

async function chargeBatteries(timeInMS) {
    log.info('Akkus werden geladen');

    if (activeCharge) {
        console.log("Akkus im Ladevogang: Start abgbrochen")
        return false
    }

    callShellyAPI(true)
    await new Promise(resolve => setTimeout(resolve, timeInMS));

    callShellyAPI(false)
    log.success('Akkus wurden eine Stunde geladen');
}

async function callShellyAPI(toggle) {

    const callURI = 'http://' + process.env.SHELLYIP + '/relay/0?turn=' + (toggle ? 'on' : 'off');
    log.data('Call', callURI);

    await axios
        .get(callURI, {
            auth: {
                username: process.env.SHELLY_WEBINTERFACE_USER,
                password: process.env.SHELLY_WEBINTERFACE_PASSWORD
            }
        })
        .then((response) => {
            requestResult = response.data;
            log.success('API-Call was successful');
            activeCharge = toggle
        })
        .catch((e) => {
            log.error(e.name + ': ' + e.message, true);
            return false
        });

    return true;
}