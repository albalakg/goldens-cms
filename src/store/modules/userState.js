import axios from "axios";

const userState = {
    namespaced: true,

    state: {
        users: null,
        totalUsers: null,
    },

    getters: {
        users: state => state.users,
        totalUsers: state => state.totalUsers
    },

    mutations: {
        SET_SIDEBAR_STATE(state, status) {
            state.sidebarState = status;
        },

        SET_GLOBAL_USERS_STATE(state, data) {
            state.totalUsers = data.total_users;
        },

        SET_NEW_USER(state, userData) {
            if(state.users) {
                state.users = state.users.unshift(userData);
            }
        }
    },

    actions: {
        getGlobalUsers({ commit }) {
            commit('SET_GLOBAL_USERS_STATE', {
                total_users: 0
            })
        },

        createUser({ commit }, userData) {
            return new Promise((resolve, reject) => {
                axios.post('users/create', userData)
                    .then(res => {
                        console.log('res.data', res);
                        commit('SET_NEW_USER', res.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createUser: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        }
    }
};

export default userState;