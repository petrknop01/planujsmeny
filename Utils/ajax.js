/**
 * Třída pro obsluhu ajax requestů
 */

import CookieManager from "react-native-cookies";

class Ajax {
    isConnected = true;
    get = (adresa, data, cookies) => {
        let dataArr = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                dataArr.push(key + "=" + element);
            }
        }

        postData = "";
        if (dataArr.length >  0) {
            postData = "&" + dataArr.join("&");
        }


        let fetchParams = {
            method: 'GET',
        };


        if (cookies) {
            fetchParams = {
                method: 'GET',
                headers: {
                    cookie: cookies
                },
                credentials: "omit",
            };
        }

        return CookieManager.clearAll().then(() => {
            return fetch(adresa + postData, fetchParams)
        });
    }

    post = (adresa, data, cookies) => {
        let formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                formData.append(key, element);
            }
        }

        let fetchParams = {
            method: 'POST',
            body: formData
        };


        if (cookies) {
            fetchParams = {
                method: 'POST',
                body: formData,
                headers: {
                    cookie: cookies
                },
                credentials: "omit",
            };
        }

        return CookieManager.clearAll().then(() => {
            return fetch(adresa, fetchParams)
        });
    }
}

export default new Ajax();


