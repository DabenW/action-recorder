import { sendEventDurationMins } from './constants';
import { sendEvents } from './recorder'

export default class Timer {

    eventSenderTimer = setInterval(() => {
        sendEvents().catch((e) => {
            console.log("[timer] 定时发送失败", e);
        });
    }, sendEventDurationMins);
}