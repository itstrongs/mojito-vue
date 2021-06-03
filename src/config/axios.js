import axios from 'axios';
import {Message} from 'element-ui'

// config 配置
axios.defaults.timeout = 60 * 1000;
// axios.defaults.baseURL = 'http://212.64.64.117:8086';
axios.defaults.baseURL = 'http://127.0.0.1:8086';

// http request 拦截器
axios.interceptors.request.use(config => {
    if (localStorage.getItem('Authorization')) {
        config.headers.Authorization = localStorage.getItem('Authorization');
    }
    return config;
}, err => {
    Message.error({message: '超时了!'});
    // return Promise.reject(err);
    return Promise.resolve(err);
});

axios.interceptors.response.use(response => {
    if (response.status && response.status === 200 && response.data.code !== 200) {
        // Message.error({message: response.data.msg});
        Message.error({message: '出错了⊙﹏⊙!'});
        return;
    }
    return response
}, err => {
    if (err.response.status === 504 || err.response.status === 404) {
        Message.error({message: '页面找不到了⊙﹏⊙!'});
    } else if (err.response.status === 403) {
        Message.error({message: '你没有权限哦！'});
    } else {
        Message.error({message: '出错了⊙﹏⊙!'});
    }
    return Promise.resolve(err);
});

export default axios;
