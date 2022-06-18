import divera, { diveraAPIArlamResult } from "./api/divera"

import dotenv from 'dotenv'

dotenv.config({
    path: './config/.env',
});

import { scheduleJob } from "node-schedule";
import log from "./util/log";

import Shelly from './api/shelly';
import JobHandler from './jobHandler';

import * as fs from "fs/promises"
import cache from "./cache";

let jobHandlers: Array<JobHandler> = [];
let shellies: Array<Shelly> = [];

init()

function startScheduleJobs(scheduelCronTime: string) {
    scheduleJob(scheduelCronTime, async () => {
        await handleDiveraArlams(await divera.getAlarms())
    });
}

async function handleDiveraArlams(calledAlarms: diveraAPIArlamResult) {
    if (calledAlarms.success) {
        for (const id in calledAlarms.data) {
            if (await cache.isAlarmCached(id)) {
                continue
            }

            jobHandlers.forEach(jH => {
                if (jH.compareTargetGroup(calledAlarms.data[id].group)) {
                    try {
                        jH.trigger()
                    } catch (e) {
                        console.error(e)
                    }
                }
            })
            await cache.cacheAlarm(id)
        }
    } else {
        return
    }
}

async function init() {
    try {
        const config = JSON.parse(
            await fs.readFile((
                process.cwd() + "/config/config.json"),
                { encoding: "utf-8" }
            )
        )

        for (const shelly in config.Shellys) {
            const tempShelly: Shelly = new Shelly(
                shelly,
                config.Shellys[shelly]
            )

            while (!(await tempShelly.connect())) {
                log.info("Try to connect in 10s")
                await new Promise((ok) => setTimeout(ok, 10000))
            }

            shellies.push(tempShelly)
        }

        for (const jH in config.DiveraJobs) {
            const jobHandlerConfig = config.DiveraJobs[jH]
            let tempShelly: Shelly

            for (let i = 0; i < shellies.length; i++) {
                const shelly = shellies[i];
                if (config.DiveraJobs[jH].shelly === shelly.name)
                    tempShelly = shelly;
            }

            let functionString: string
            let argsString: 'on' | 'off' | 'toggel'

            for (const job in jobHandlerConfig.job) {
                functionString = job
                argsString = jobHandlerConfig.job[job]
            }

            jobHandlers.push(
                new JobHandler(jH,
                    jobHandlerConfig.groups,
                    tempShelly,
                    [functionString, argsString]
                )
            )
        }
        startScheduleJobs(config.diveraCallFrequence)

    }
    catch (err) {
        if (err.code === 'ENOENT') {
            log.error("/config/config.json konnte nicht gefunden werden")
            return
        }
        if (err instanceof SyntaxError) {
            log.error("/config/config.json hat ein falsches Format")
            return
        }
        throw err
    }
}