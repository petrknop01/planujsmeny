
import { NetInfo } from 'react-native';
import CookieManager from "react-native-cookies";
import UrlsApi from "./urls";

class Ajax {
    isConnected = true;

    // constructor() {
    //     NetInfo.isConnected.fetch((isConnected) => this.isConnected = isConnected)
    //     NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => this.isConnected = isConnected);
    // }

    get = (adresa, data, cookies) => {
        console.log(adresa);
        // if (!this.isConnected) {
        //     return Promise.reject(new Error('Není připojení k internetu'))
        // }

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
        console.log(adresa);
        // if (!this.isConnected) {
        //     return Promise.reject(new Error('Není připojení k internetu'))
        // }

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


