const AppState = {
    namespaced: true,

    state: {
        name: 'Goldens',
        sidebarState: true,
        globalSearchState: false,
        isLogged: false,
        language: 'English',
        itemsPerPage: 5,
        requests: {
            sent: [],
            done: []
        },
        isFinishedInitLoad: false
    },

    getters: {
        appName:                state => state.name,
        sidebarState:           state => state.sidebarState,
        globalSearchState:      state => state.globalSearchState,
        isLogged:               state => state.isLogged,
        itemsPerPage:           state => state.itemsPerPage,
        language:               state => state.language,
        isLoading:              state => state.requests.sent.length !== state.requests.done.length,
        isFinishedInitLoad:     state => state.isFinishedInitLoad,
    },

    mutations: {
        SET_SIDEBAR_STATE(state, status) {
            state.sidebarState = status;
        },

        SET_GLOBAL_SEARCH_STATE(state, status) {
            state.globalSearchState = status;
        },

        SET_LOG_STATE(state, status) {
            state.isLogged = status;
        },
        
        SET_ITEMS_PER_PAGE(state, itemsPerPage) {
            state.itemsPerPage = itemsPerPage;
        },

        SET_REQUEST_SENT(state, request) {
            state.requests.sent.push(request);
        },

        SET_REQUEST_DONE(state, response) {
            state.requests.done.push(response);
        },

        SET_FINISHED_INIT_LOAD(state) {
            state.isFinishedInitLoad = true;
        },
    },

    actions: {
        updateSidebarState({ commit }, state) {
            commit('SET_SIDEBAR_STATE', state)
        },

        updateGlobalSearchState({ commit }, state) {
            commit('SET_GLOBAL_SEARCH_STATE', state)
        },
        
        updateLogState({ commit }, state) {
            commit('SET_LOG_STATE', state)
        },
        
        updateItemsPerPage({ commit }, itemsPerPage) {
            commit('SET_ITEMS_PER_PAGE', itemsPerPage)
        },
        
        requestSent({ commit }, request) {
            commit('SET_REQUEST_SENT', request);
        },

        requestDone({ commit }, response) {
            commit('SET_REQUEST_DONE', response);
        },

        setFinishedInitLoad({ commit }) {
            commit('SET_FINISHED_INIT_LOAD');
        },
    }
};

export default AppState;