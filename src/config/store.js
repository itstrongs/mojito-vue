import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({

    state: {
        // 存储token
        Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
        userId: ''
    },

    mutations: {
        // 修改token，并将token存入localStorage
        changeLogin (state, user) {
            state.Authorization = user.Authorization;
            state.userId = user.id;
            localStorage.setItem('Authorization', user.Authorization);
            localStorage.setItem('userId', user.id);
        }
    }
});

export default store;
