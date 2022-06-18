import Shelly from './api/shelly';
import log from './util/log';


export default class JobHandler {
    title: string
    targetGroupsIDs: Array<number>
    shelly: Shelly
    job: Array<string>
    isActive: boolean = false

    constructor(title: string, targetGroupsIDs: Array<number>, shelly: Shelly, job: Array<string>) {
        this.title = title
        this.targetGroupsIDs = targetGroupsIDs
        this.shelly = shelly
        this.job = job
    }

    trigger() {
        if (!this.isActive && this.shelly.isConnected) {
            this.isActive = true
            log.info(`Start job: ${this.title}`, true)
            this.start()
        } else {
            log.info("Job is active -> Can not execute")
        }
    }

    async start() {
        while (!(await this.shelly.connect())) {
            log.info("Try to connect in 5s")
            await new Promise((ok) => setTimeout(ok, 5000))
        }

        await this.shelly.do(this.job[0], this.job[1])
        this.isActive = false
        log.info(`Close job: ${this.title}`, true)
    }

    compareTargetGroup(alarmGroups: Array<Number>) {
        for (let i = 0; i < this.targetGroupsIDs.length; i++) {
            if (alarmGroups.includes(this.targetGroupsIDs[i])) {
                return true
            }
        }
        return false
    }
}
