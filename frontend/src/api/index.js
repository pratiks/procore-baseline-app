/**
 * @file api-service provides promise-based HTTP abstraction with extended error
 *
 *
 *
 */

import { Notification } from 'element-ui';
import router from '@/router';
import { getToken, setToken, setRefreshToken, destroyToken, getRefreshToken } from '@/utils/token';

const baseURL = `http://localhost:8080`
this.axios.defaults.headers.post['Content-Type'] = 'application/json';
this.axios.create({ baseURL, timeout: 20000 })


// global request interceptor
this.axios.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, ((error) => { return Promise.reject(error)}))


// global response interceptor
this.axios.interceptors.response.use(response => {
        const originalRequest = response.config;
        console.log('Interceptor: Response from ', originalRequest.url, response);
        return response;
    },
    (error) => {
        console.log(error)
        const originalRequest = error.config;
        /** 401: Failed Refresh Token Fetch, Logout User and redirect Back to Login Page */
        if ((error.response.status === 401 && originalRequest._retry)){
            console.log('Refresh failed, will not attempt to destroyToken or push route back to Login')
            // destroyToken();
            // router.push('/Login');
            return Promise.reject(error);
        }

        /** 401: Token has expired, fetch refresh and access_token and retry */
        if (error.response.status === 401 && !originalRequest._retry) {
            console.warn('attempting refresh of token')
            originalRequest._retry = true;
            const refresh_token =  getRefreshToken();

            return this.axios.post('/api/procore/refresh', {refresh_token})
                .then((response) => {

                    setToken(response.data.access_token);
                    setRefreshToken(response.data.refresh_token);

                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;
                    return this.$http(originalRequest);
                }).catch((error) => {
                    //destroy //
                    console.log(error);
                    return Promise.reject(error)
                })
        }

    })


export default {

    tokenRefresh(data) {
        return this.axios.post('/api/procore/refresh', data)
    }


}

