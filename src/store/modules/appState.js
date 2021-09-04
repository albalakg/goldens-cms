const appState = {
    namespaced: true,

    state: {
        name: 'Goldens',
        sidebarState: true,
        isLogged: false
    },

    getters: {
        appName: state => state.name,
        sidebarState: state => state.sidebarState,
        isLogged: state => state.isLogged,
    },

    mutations: {
        SET_SIDEBAR_STATE(state, status) {
            state.sidebarState = status;
        },
        SET_LOG_STATE(state, status) {
            state.isLogged = status;
        },
    },

    actions: {
        updateSidebarState({ commit }, state) {
            commit('SET_SIDEBAR_STATE', state)
        },
        updateLogState({ commit }, state) {
            commit('SET_LOG_STATE', state)
        },
    }
};

export default appState;