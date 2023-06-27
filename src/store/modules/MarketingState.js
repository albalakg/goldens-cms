import axios from "axios";
import { serialize } from "object-to-formdata";

const MarketingState = {
    namespaced: true,

    state: {
        marketings: null,
    },

    getters: {
        marketings: state => state.marketings,
    },

    mutations: {
        SET_NEW_MARKETING(state, marketingData) {
            if(!state.marketings) {
                return;
            }

            state.marketings.unshift(marketingData);
        },

        SET_UPDATED_MARKETING(state, marketingData) {
            if(!state.marketings) {
                return;
            }
            
            const marketingIndex = state.marketings.findIndex(marketing => marketing.id === marketingData.id);
            if(marketingIndex < 0) {
                return;
            }
            
            marketingData.created_at = state.marketings[marketingIndex].created_at;
            state.marketings[marketingIndex] = marketingData;
        },

        SET_MARKETINGS(state, marketings) {
            state.marketings = marketings;
        },

        DELETE_MARKETING(state, marketing_ids) {
            if(state.marketings) {
                state.marketings = state.marketings.filter(marketing => !marketing_ids.includes(marketing.id));
            }
        }
    },

    actions: {
        getMarketings({ commit, dispatch }) {
            return new Promise((resolve) => {
                commit('SET_MARKETINGS', null);

                axios.get('cms/marketing')
                    .then(res => {
                        commit('SET_MARKETINGS', res.data.data);
                    })
                    .catch(err => {
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to fetch Marketings',
                            type: 'error',
                        }, {root:true});
                        console.warn('getMarketings: ', err);
                    })
                    .finally(() => {
                        resolve()
                    })
            })
        },

        getMarketing({ state }, marketingID) {
            return new Promise((resolve) => {
                if(state.marketings) {
                    resolve(state.marketings.find(marketing => marketing.id == marketingID))
                } else {
                    resolve(null)
                }
            })
        },

        createMarketing({ commit }, marketingData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(marketingData, { indices: true });
                axios.post('cms/marketing/create', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_NEW_MARKETING', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createMarketing: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateMarketing({ commit }, marketingData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(marketingData, { indices: true });
                axios.post('cms/marketing/update', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_UPDATED_MARKETING', marketingData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateMarketing: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        deleteMarketings({ commit, dispatch }, marketing_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/marketing/delete', { ids: marketing_ids })
                    .then(() => {
                        commit('DELETE_MARKETING', marketing_ids);
                        dispatch('MessageState/addMessage', {
                            message: 'Marketing has been deleted successfully',
                        }, { root: true });
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteMarketing: ', err.response.data);
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to delete the marketing',
                        }, { root: true });
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default MarketingState;