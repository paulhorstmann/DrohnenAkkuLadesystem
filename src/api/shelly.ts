import axios, { Method } from "axios";
import logUpdate from 'log-update';
import chalk from 'chalk';
import log from "../util/log";

interface shellyConfig {
    ip: string,
    hostname?: string,
    username?: string
    password?: string
}

class Shelly {
    name: string
    ip: string
    hostname?: string
    httpConfig: any = {}

    isConnected: boolean = false
    isActive: boolean


    constructor(name: string, config: shellyConfig) {
        this.name = name
        this.ip = config.ip

        if (config.hostname)
            this.hostname = config.hostname

        if (config && config.username) {
            this.httpConfig = {
                auth: {
                    username: config.username,
                    password: config.password
                }
            }
        }
    }

    async do(term: string, arg: string) {
        switch (term) {
            case "turn": await this.turn(arg); break;
            case "timer": await this.timer(Number.parseInt(arg)); break;
            default: return () => { log.error("Config goes wrong") }
        }
    }

    async connect(): Promise<boolean> {
        log.info(`Try to connect to Shelly: ${this.name}`)
        this.isConnected = false

        const url = `http://${this.hostname ? this.hostname : this.ip}/status`
        await axios
            .get(url, this.httpConfig)
            .then((response) => {
                if (response.status = 200) {
                    log.success('Shelly is connected');
                    this.isConnected = true
                }
            })
            .catch((e) => {
                log.error(`Can't connect to ${this.name}`)
            });

        return this.isConnected

    }

    async timer(ms: number) {
        log.info(`Turn on Shelly: ${this.name} for ${ms}ms`, true)
        await this.turn("on")

        await new Promise(resolve => setTimeout(resolve, ms));

        await this.turn("off")
    }

    async turn(turn: string) {
        const callURI = 'http://' + this.ip + '/relay/0?turn=' + (turn);
        await axios
            .get(callURI, this.httpConfig)
            .then((response) => {
                log.success(`Shelly call turn ${turn}`);
            })
            .catch((e) => {
                log.error(e.name + ': ' + e.message, true);
                return false
            });

        return true;
    }
}

export default Shelly