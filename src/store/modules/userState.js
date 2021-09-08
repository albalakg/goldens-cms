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
        },

        SET_USERS(state, users) {
            state.users = users;
        },

        DELETE_USER(state, user_ids) {
            if(state.users.data) {
                state.users.data = state.users.data.filter(user => !user_ids.includes(user.id));
            }
        }
    },

    actions: {
        getGlobalUsers({ commit }) {
            commit('SET_GLOBAL_USERS_STATE', {
                total_users: 0
            })
        },

        getUsers({ commit }) {
            axios.get('users')
                .then(res => {
                    commit('SET_USERS', res.data.data);
                })
                .catch(err => {
                    console.warn('getUsers: ', err);
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
        },

        deleteUsers({ commit }, user_ids) {
            console.log('user_ids', user_ids);
            commit('DELETE_USER', user_ids);
            // return new Promise((resolve, reject) => {
            //     axios.post('users/delete', { user_ids })
            //         .then(res => {
            //             console.log('res.data', res);
            //             commit('DELETE_USER', user_ids);
            //         })
            //         .catch(err => {
            //             console.warn('deleteUser: ', err.response.data);
            //             reject(err.response.data)
            //         })
            // }) 
        },
        
    }
};

export default userState;