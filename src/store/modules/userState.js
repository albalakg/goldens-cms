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
            if (!state.users) {
                return;
            }

            state.users.unshift(userData);
        },

        SET_UPDATED_USER(state, userData) {
            if (!state.users) {
                return;
            }

            const userIndex = state.users.findIndex(user => user.id === userData.id);
            if (userIndex < 0) {
                return;
            }

            userData.email = state.users[userIndex].email;
            userData.created_at = state.users[userIndex].created_at;
            userData.full_name = userData.first_name + ' ' + userData.last_name;
            state.users[userIndex] = { ...userData };
        },

        SET_UPDATED_USER_EMAIL(state, userData) {
            if (!state.users) {
                return;
            }

            const userIndex = state.users.findIndex(user => user.id === userData.id);
            if (userIndex < 0) {
                return;
            }

            state.users[userIndex].email = userData.email;
        },

        SET_USERS(state, users) {
            // add full name
            if (users) {
                users = users.map(user => {
                    user.full_name = user.first_name + ' ' + user.last_name;
                    return user;
                })
            }

            state.users = users;
        },

        DELETE_USER(state, user_ids) {
            if (state.users) {
                state.users = state.users.filter(user => !user_ids.includes(user.id));
            }
        }
    },

    actions: {
        getUsers({ commit, dispatch }) {
            return new Promise((resolve) => {
                commit('SET_USERS', null);

                axios.get('cms/users')
                    .then(res => {
                        commit('SET_USERS', res.data.data);
                    })
                    .catch(err => {
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to fetch Users',
                            type: 'error',
                        }, { root: true });
                        console.warn('getUsers: ', err);
                    })
                    .finally(() => {
                        resolve()
                    })
            })
        },

        getUser({ state }, userID) {
            return new Promise((resolve) => {
                if (state.users) {
                    resolve(state.users.find(user => user.id == userID))
                } else {
                    resolve(null)
                }
            })
        },

        async searchByName({ dispatch }, searchInput) {
            return await dispatch('searchByInput', { searchInput, field: 'full_name', field_name: 'name' });
        },

        async searchByEmail({ dispatch }, searchInput) {
            return await dispatch('searchByInput', { searchInput, field: 'email' });
        },

        async searchByPhone({ dispatch }, searchInput) {
            return await dispatch('searchByInput', { searchInput, field: 'phone' });
        },

        searchByInput({ state }, data) {
            if (!state.users) {
                return;
            }

            const results = [];
            state.users.forEach(user => {
                if (user && user[data.field]) {
                    const field = user[data.field];
                    if (field.toLowerCase().includes(data.searchInput)) {
                        const text = data.field === 'name' ? field : field + ` (${user.full_name})`;
                        results.push({
                            text: text,
                            component: 'User',
                            type: `User's ${data.field_name ? data.field_name : data.field}`,
                            path: `/users/show/${user.id}`
                        })
                    }
                }
            });
            return results;
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

        // eslint-disable-next-line no-empty-pattern
        updatePassword( {}, userData) {
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
                    .then(() => {
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