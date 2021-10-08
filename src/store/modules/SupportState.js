import axios from "axios";
import { serialize } from "object-to-formdata";

const SupportState = {
    namespaced: true,

    state: {
        support_tickets: null,
        support_categories: null,
    },

    getters: {
        support_tickets: state => state.support_tickets,
        support_categories: state => state.support_categories,
    },

    mutations: {
        SET_NEW_SUPPORT_CATEGORY(state, data) {
            if(!state.support_categories) {
                return;
            }

            state.support_categories.unshift(data);
        },

        SET_UPDATED_SUPPORT_TICKET(state, supportData) {
            if(!state.support_tickets) {
                return;
            }
            
            const supportIndex = state.support_tickets.findIndex(support => support.id === supportData.id);
            if(supportIndex < 0) {
                return;
            }
            
            supportData.created_at = state.support_tickets[supportIndex].created_at;
            state.support_tickets[supportIndex] = supportData;
        },

        SET_SUPPORT_TICKETS(state, support_tickets) {
            state.support_tickets = support_tickets;
        },

        SET_SUPPORT_CATEGORIES(state, support_categories) {
            state.support_categories = support_categories;
        },

        DELETE_SUPPORT_CATEGORIES(state, ids) {
            if(state.support_categories) {
                state.support_categories = state.support_categories.filter(support => !ids.includes(support.id));
            }
        }
    },

    actions: {
        getSupportTickets({ state, commit, dispatch }) {
            if(state.support_tickets) {
                return;
            }

            axios.get('cms/support/tickets')
                .then(res => {
                    commit('SET_SUPPORT_TICKETS', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Support Tickets',
                        type: 'error',
                    }, {root:true});
                    console.warn('getSupportTickets: ', err);
                })
        },

        getSupportCategories({ state, commit, dispatch }) {
            if(state.support_categories) {
                return;
            }

            axios.get('cms/support/categories')
                .then(res => {
                    commit('SET_SUPPORT_CATEGORIES', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Support Tickets',
                        type: 'error',
                    }, {root:true});
                    console.warn('getSupportCategories: ', err);
                })
        },

        getSupport({ state }, supportID) {
            return new Promise((resolve, reject) => {
                if(state.support_tickets) {
                    resolve(state.support_tickets.find(support => support.id == supportID))
                } else {
                    resolve(null)
                }
            })
        },

        getSupportCategory({ state }, supportCategoryID) {
            return new Promise((resolve, reject) => {
                if(state.support_tickets) {
                    resolve(state.support_categories.find(support => support.id == supportCategoryID))
                } else {
                    resolve(null)
                }
            })
        },

        createSupportCategory({ commit }, supportData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/support/categories/create', supportData)
                    .then(res => {
                        commit('SET_NEW_SUPPORT_CATEGORY', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createSupportCategory: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        deleteSupportCategories({ commit, dispatch }, data) {
            return new Promise((resolve, reject) => {
                axios.post('cms/support/categories/delete', {ids: data})
                    .then(res => {
                        commit('DELETE_SUPPORT_CATEGORIES', data);
                        dispatch('MessageState/addMessage', {
                            message: 'Support Categories deleted successfully',
                        }, {root:true});
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('deleteSupportCategories: ', err);
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to delete the Support Categories',
                            type: 'error',
                        }, {root:true});
                        reject(err.response.data)
                    })
            }) 
        },

        updateSupportTicketStatus({ commit }, supportData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/support/tickets/status/update', supportData)
                    .then(res => {
                        commit('SET_UPDATED_SUPPORT_TICKET', supportData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateSupportTicketStatus: ', err);
                        reject(err.response.data)
                    })
            }) 
        },
    }
};

export default SupportState;