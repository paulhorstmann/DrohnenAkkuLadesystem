import * as fs from "fs/promises"
import log from "./util/log"

async function isAlarmCached(alarmID: string): Promise<boolean> {
    try {
        const cache: Array<string> | string = JSON.parse(await fs.readFile((
            process.cwd() + "/cache/lastAlarms.json"),
            { encoding: "utf-8" }
        ))

        if (cache instanceof Array)
            return cache.includes(alarmID)

        return false
    } catch (e) {
        console.log(e)
        log.error("Cannot read the cache")
    }
}

async function cacheAlarm(alarmID: string) {

    try {
        let cache = JSON.parse(await fs.readFile((
            process.cwd() + "/cache/lastAlarms.json"),
            { encoding: "utf-8" }
        ))

        if (cache instanceof Array) {
            cache.push(alarmID)
        } else {
            cache = []
        }

        await fs.writeFile(
            process.cwd() + "/cache/lastAlarms.json", JSON.stringify(cache));
    } catch (err) {
        console.log(err);
    }

}

export default { isAlarmCached, cacheAlarm }