import axios from "axios";
import store from "../store"

axios.interceptors.request.use(function (config) {
        store.dispatch('AppState/requestSent', config.url)
        // Do something before request is sent
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

axios.interceptors.response.use(function (response) {
        store.dispatch('AppState/requestDone', {
            url: response.config.url,
            data: response.data,
        })
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    });