export var EventType = {
    OPEN : 'OPEN',
    CLOSE : 'CLOSE',
    KEY_PRESS : 'KEY_PRESS',
    MOUSE : 'MOUSE'
}

export function getEvent(type, createTime, projectName, rawData) {
    return {
        type,
        createTime,
        projectName,
        rawData
    };
}