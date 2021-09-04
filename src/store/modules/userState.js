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
    },

    actions: {
        getGlobalUsers({ commit }) {
            commit('SET_GLOBAL_USERS_STATE', {
                total_users: 0
            })
            // axios.get('users/global')
            //     .then(res => {
            //         commit('SET_GLOBAL_USERS_STATE', res.data.data)
            //     })
            //     .catch(err => {
            //         commit('SET_GLOBAL_USERS_STATE', {
            //             total_users: 0
            //         })
            //     })
        }
    }
};

export default userState;