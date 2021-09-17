const AppState = {
    namespaced: true,

    state: {
        name: 'Goldens',
        sidebarState: true,
        isLogged: false,
        itemsPerPage: 5
    },

    getters: {
        appName: state => state.name,
        sidebarState: state => state.sidebarState,
        isLogged: state => state.isLogged,
        itemsPerPage: state => state.itemsPerPage,
    },

    mutations: {
        SET_SIDEBAR_STATE(state, status) {
            state.sidebarState = status;
        },
        SET_LOG_STATE(state, status) {
            state.isLogged = status;
        },
        SET_ITEMS_PER_PAGE(state, itemsPerPage) {
            state.itemsPerPage = itemsPerPage;
        },
    },

    actions: {
        updateSidebarState({ commit }, state) {
            commit('SET_SIDEBAR_STATE', state)
        },
        
        updateLogState({ commit }, state) {
            commit('SET_LOG_STATE', state)
        },
        
        updateItemsPerPage({ commit }, itemsPerPage) {
            commit('SET_ITEMS_PER_PAGE', itemsPerPage)
        },
    }
};

export default AppState;