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
            if(!state.users) {
                return;
            }

            state.users.data.unshift(userData);
        },

        SET_UPDATED_USER(state, userData) {
            if(!state.users) {
                return;
            }
            
            const userIndex = state.users.data.findIndex(user => user.id === userData.id);
            if(userIndex < 0) {
                return;
            }

            userData.email = state.users.data[userIndex].email;
            userData.created_at = state.users.data[userIndex].created_at;
            userData.full_name = userData.first_name + ' ' + userData.last_name;
            state.users.data[userIndex] = {...userData};
        },

        SET_UPDATED_USER_EMAIL(state, userData) {
            console.log('userData', userData);
            if(!state.users) {
                return;
            }

            const userIndex = state.users.data.findIndex(user => user.id === userData.id);
            console.log('userIndex', userIndex);
            if(userIndex < 0) {
                return;
            }
            
            console.log('state.users.data[userIndex]', state.users.data[userIndex]);
            state.users.data[userIndex].email = userData.email;
        },

        SET_USERS(state, users) {
            // add full name
            users.data = users.data.map(user => {
                user.full_name = user.first_name + ' ' + user.last_name;
                return user; 
            })

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

        getUsers({ commit, dispatch }) {
            axios.get('cms/users')
                .then(res => {
                    commit('SET_USERS', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch the users',
                        type: 'error',
                    }, {root:true});
                    console.warn('getUsers: ', err);
                })
        },

        getUser({ state }, userID) {
            return new Promise((resolve, reject) => {
                if(state.users) {
                    resolve(state.users.data.find(user => user.id == userID))
                } else {
                    resolve(null)
                }
            })
        },

        createUser({ commit }, userData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/users/create', userData)
                    .then(res => {
                        commit('SET_NEW_USER', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createUser: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateUser({ commit }, userData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/users/update', userData)
                    .then(res => {
                        commit('SET_UPDATED_USER', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateUser: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        updateEmail({ commit }, userData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/users/update/email', userData)
                    .then(res => {
                        commit('SET_UPDATED_USER_EMAIL', userData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateEmail: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        updatePassword({ commit }, userData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/users/update/password', userData)
                    .then(res => {
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updatePassword: ', err);
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