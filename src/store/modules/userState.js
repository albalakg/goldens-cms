import axios from "axios";

const UserState = {
    namespaced: true,

    state: {
        users: null,
    },

    getters: {
        users: state => state.users,
    },

    mutations: {
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
            if(!state.users) {
                return;
            }

            const userIndex = state.users.data.findIndex(user => user.id === userData.id);
            if(userIndex < 0) {
                return;
            }
            
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
        getUsers({ state, commit, dispatch }) {
            if(state.users) {
                return;
            }

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
                        commit('SET_NEW_USER', userData);
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
            return new Promise((resolve, reject) => {
                axios.post('cms/users/delete', { ids: user_ids })
                    .then(res => {
                        commit('DELETE_USER', user_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteUser: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default UserState;