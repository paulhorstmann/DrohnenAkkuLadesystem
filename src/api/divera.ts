import axios from "axios";
import log from '../util/log'

import dotenv from 'dotenv'

dotenv.config({
    path: './config/.env',
});

const diveraURL = process.env.DIVETAURL;
const diveraAccessKey = process.env.DIVERAAPIKEY;

export interface diveraAlarm {
    id: string
    title: string,
    text?: string,
    group: Array<number>
}

export interface diveraAPIArlamResult {
    success: boolean
    data?: {
        items?: diveraAlarm
        sorting?: Array<number>
    }
}

const defaultErrorAPI: diveraAPIArlamResult = {
    success: false
}

async function getAlarms(): Promise<diveraAPIArlamResult> {
    let result = defaultErrorAPI;

    await axios
        .get(diveraURL + '/api/v2/alarms', {
            method: 'GET',
            params: {
                accesskey: diveraAccessKey
            }
        })
        .then((response: any) => {

            if ("success" in response.data && !response.data.success) {
                log.error('Success false');
                return
            }

            result.success = true
            result.data = response.data.data.items
        })
        .catch((e) => {
            log.error(e.message, true);
        });

    return result;
}

export default { getAlarms }