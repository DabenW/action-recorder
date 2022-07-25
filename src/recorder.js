import { EventType, getEvent } from './event';
import { sendEventDuration, DOMAIN, timeout } from './constants';
const axios = require('axios');

var eventQueue = new Array();
var ideId = '';
var misId = '';
var isRecordMouse = false; // 用于鼠标事件节流

export class Recorder {
    constructor(id, projectName, mis) {
        ideId = id;
        misId = mis;
        this.x = 0;
        this.y = 0;
        this.projectName = projectName;
        this.eventSenderTimer = setInterval(() => {
            try {
                sendEvents()
            } catch (e) {
                console.log("[timer] 定时发送失败", e);
            }
        }, sendEventDuration);
    }

    record() {
        console.log(this.projectName, "id:", ideId, "mis", misId)

        let mouseRecordTimer = setInterval(this.resetMouseRecorder, 333);

        document.onmousemove = (e) => {
            let x1 = e.clientX;
            let y1 = e.clientY;
            if (isRecordMouse == true && (this.x != x1 || this.y != y1)) {
                console.log("鼠标");
                this.putEvent(EventType.MOUSE);
                isRecordMouse = false;
            }
            this.x = x1;
            this.y = y1;
        }

        document.onkeydown = (e) => {
            console.log("键盘敲击");
            this.putEventWithRawData(EventType.KEY_PRESS, { char: e.key });
        }
    }

    resetMouseRecorder() {
        isRecordMouse = true;
        return;
    }

    putEvent(eventType) {
        this.putEventWithRawData(eventType, null);
    }

    putEventWithRawData(eventType, rawData) {
        var event = getEvent(eventType, Date.parse(new Date().toString()), this.projectName, rawData === null ? null : JSON.stringify(rawData));

        eventQueue.push(event);
    }
}

export async function sendEvents() {
    console.log("发送事件")
    // 获取事件
    var maxSize = 50;
    var eventList = new Array();
    for (let i = 0; i < maxSize; i++) {
        let event = eventQueue.shift()
        if (event) {
            eventList.push(event);
        } else {
            break;
        }
    }
    console.log("send event", eventList.length)
    // 构建参数
    const request = {
        ideId: ideId,
        eventList: eventList
    };

    if (eventList.length <= 0) {
        return;
    }

    try {
        console.log(JSON.stringify(request));
        const response = await send("/api/1.0/projector/event/record", misId, request);
        if (!isResponseOk(response)) {
            console.error("post 请求失败", response.data)
        }
    } catch (e) {
        console.error("post 请求失败", e)
    }
}

export async function send(api, misId, data) {
    const response = await axios({
        method: 'post',
        headers: {
            'Authorization': misId
        },
        baseURL: DOMAIN,
        url: api,
        timeout: timeout,
        data: data,
    });
    return response;
}

function isResponseOk(response) {
    return response.status === 200 && response.data && response.data.code === 0;
}
