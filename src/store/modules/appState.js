const appState = {
    namespaced: true,

    state: {
        name: 'Goldens',
        sidebarState: true
    },

    getters: {
        appName: state => state.name,
        sidebarState: state => state.sidebarState,
    },

    mutations: {
        SET_SIDEBAR_STATE(state, status) {
            state.sidebarState = status;
        }
    },

    actions: {
        updateSidebarState({ commit }, state) {
            commit('SET_SIDEBAR_STATE', state)
        }
    }
};

export default appState;