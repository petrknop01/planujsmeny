var PushNotification = require('react-native-push-notification');
import { PushNotificationIOS, Platform } from "react-native";
import DataStore from "./dataStore";
import Ajax from "./ajax";
import { UrlsApi } from "./urls";
import { calculateDate, timeToString } from "./functions";

function loadJobsAndWorkplaces(address, cookie, relogin, callback) {
    Ajax.get(address + UrlsApi.jobsAndWorkplaces, {}, cookie)
        .then(response => response.json())
        .then(response => {
            if (response.ok == 0) {
                if (response.loggedOut == 1) {
                    relogin(() => loadJobsAndWorkplaces(address, cookie, relogin, callback))
                }
                return;
            }
            callback(address, cookie, relogin, response.jobs, response.wps);
        });
}


function loadDates(address, cookie, relogin, callback) {
    let date = new Date();
    let data = {
        from: timeToString(date),
        to: calculateDate(date, +1),
    }
    Ajax.get(address + UrlsApi.shifts, data, cookie)
        .then(response => response.json())
        .then(response => {
            if (response.ok == 0) {
                if (response.loggedOut == 1) {
                    relogin(() => loadDates(address, cookie, relogin, callback));
                }
                return;
            }
            callback(response.shifts);
        });
}

function getJobsName(jobs, id) {
    if (!jobs || !jobs.hasOwnProperty("id" + id)) {
        return "";
    }

    let job = jobs["id" + id];
    return job.name
}

function getWorkspaceName(workplaces, id) {
    if (!workplaces || !workplaces.hasOwnProperty("id" + id)) {
        return "";
    }

    let workplace = workplaces["id" + id];
    return workplace.name
}

function schedule(date, title, text) {
    if(date < new Date()){
        return;                                            
    }

    PushNotification.localNotificationSchedule({
        title: title,
        message: text,
        date: date
    });

}

function toDate(datetime) {
    var bits = datetime.split(/\D/);
    let parseDate = new Date(bits[0], parseInt(bits[1]) - 1, bits[2], bits[3], bits[4]);
    Platform.select({
        ios: parseDate.setHours(parseDate.getHours()),
        android: parseDate.setHours(parseDate.getHours())
    });

    return parseDate
}


class Notification {
    constructor() {
        PushNotification.configure({
            onNotification: function (notification) {
                if (Platform.OS == "ios") {
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
            },
            senderID: "PLANUJSMENY-123AHOJ123AHOJ",
        });
    }

    scheduleNotification(address, cookie, relogin) {
        DataStore.GetNotificationSetting((data) => {
            loadJobsAndWorkplaces(address, cookie, relogin,
                (address, cookie, relogin, jobs, wps) => loadDates(address, cookie, relogin,
                    (shifts) => {
                        this.clearNotification();
                        
                        for (const key in shifts) {
                            if (shifts.hasOwnProperty(key)) {
                                const shifts2 = shifts[key];
                                const strTime = timeToString(key.replace("d", ""));

                                for (const key2 in shifts2) {
                                    if (shifts2.hasOwnProperty(key2)) {
                                        const shift = shifts2[key2];
                                        let item = {
                                            position: getJobsName(jobs, shift.job),
                                            name: getWorkspaceName(wps, shift.wp),
                                            timeFrom: shift.start ? toDate(strTime + " " + shift.start) : null,
                                            timeTo: shift.end ? toDate(strTime + " " + shift.end) : null,
                                        };

                                        if (item.timeFrom) {
                                            if (data.longTermStart.enabled) {
                                                let date = new Date(item.timeFrom);
                                                date.setHours(date.getHours() - data.longTermStart.value);
                                                schedule(date, "Za " + data.longTermStart.value + "hod. Vám začíná směna", "Dne " + strTime + " v " + shift.start + " Vám začíná směna na pozici " + item.position + " na pracovním místě " + item.name);
                                            }

                                            if (data.shortTermStart.enabled) {
                                                let date = new Date(item.timeFrom);
                                                date.setMinutes(date.getMinutes() - data.shortTermStart.value);
                                                schedule(date, "Za " + data.shortTermStart.value + "min. Vám začíná směna", "Dne " + strTime + " v " + shift.start + " Vám začíná směna na pozici " + item.position + " na pracovním místě " + item.name);
                                            }
                                        }

                                        if (item.endTerm) {
                                            if (data.endTerm.enabled) {
                                                let date = new Date(item.endTerm);
                                                date.setMinutes(date.getMinutes() - data.endTerm.value);
                                                schedule(date, "Za " + data.endTerm.value + "hod. Vám končí směna", "V " + shift.end + " Vám končí směna na pozici " + item.position + " na pracovním místě " + item.name);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }));
        });
    }


    clearNotification(){
        PushNotification.cancelAllLocalNotifications()
    }
}

export default Notification;