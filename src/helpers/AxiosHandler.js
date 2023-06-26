import axios from "axios";
import store from "../store";
import router from "../router";

const UNAUTHORIZED_ERROR   = 401;
const VALIDATION_ERROR     = 422;

axios.interceptors.request.use(
  function(config) {
    store.dispatch("AppState/requestSent", config.url);
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    store.dispatch("AppState/requestDone", {
      url: response.config.url,
      data: response.data,
    });
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function(error) {
    if (error.response.status === UNAUTHORIZED_ERROR) {
      handleUnauthorize();
    }
    
    if (error.response.status === VALIDATION_ERROR) {
      handleValidation(error.response);
    }
    
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

function handleUnauthorize() {
  if (!window.location.pathname.includes("logout")) {
    router.push("/logout");
  }
}

function handleValidation(response) {
    if(!response || !response.data || !response.data.errors) {
        return;
    }

    for(let errorKey in response.data.errors) {
        response.data.errors[errorKey].forEach(errorMessage => {
            store.dispatch('MessageState/addMessage', {
                message: errorMessage,
                type: 'error',
            }, { root: true });
        });
    }
}
