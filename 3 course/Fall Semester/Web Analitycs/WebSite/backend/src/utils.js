import crypto, { pbkdf2Sync } from 'node:crypto';

export function getDatetimeFromTimestamp(timestamp) {
    const date = new Date(timestamp);

    const dateObj = {
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString(),
        day: date.getDate().toString()
    }

    const timeObj = {
        hours: date.getHours().toString(),
        minutes: date.getMinutes().toString(),
        seconds: date.getSeconds().toString()
    }

    let dateStr = ''; let timeStr = '';
    
    for (let prop in dateObj) {
        dateStr += (dateObj[prop].length < 2 ? "0" + dateObj[prop] : dateObj[prop]) + "-";
    }

    for (let prop in timeObj) {
        timeStr += (timeObj[prop].length < 2 ? "0" + timeObj[prop] : timeObj[prop]) + ":";
    }
    
    return dateStr.substring(0, dateStr.length - 1) + " " + timeStr.substring(0, timeStr.length - 1);
}

export function hashPassword(password) {
    const salt = crypto.randomBytes(128).toString('base64');
    const iterations = 10000;
    const hash = pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
    return {
        salt,
        hash,
    };
}

export function getHashFromSaltPassword(password, salt) {
    const iterations = 10000;
    const hash = pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
    return hash;
}

export default {
    hashPassword,
    getHashFromSaltPassword,
    getDatetimeFromTimestamp,
}