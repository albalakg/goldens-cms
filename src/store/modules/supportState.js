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
            if(state.support_categories) {
                state.support_categories.unshift(data);
            }
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
        },

        SET_NEW_SUPPORT_TICKET_MESSAGE(state, data) {
            state.support_tickets.forEach(ticket => {
                if(ticket.id === data.support_ticket_id) {
                    ticket.messages.unshift(data);
                }
            })
        }
    },

    actions: {
        getSupportTickets({ commit, dispatch }) {
            commit('SET_SUPPORT_TICKETS', null);

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

        getSupportCategories({ commit, dispatch }) {
            commit('SET_SUPPORT_CATEGORIES', null);

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
        
        async searchBySupportNumber({dispatch}, searchInput) {
            return await dispatch('searchByInput', {searchInput, field: 'support_number', field_name: 'support number'}); 
        },
                
        searchByInput({state}, data) {
            const results = [];
            state.support_tickets.forEach(support => {
            if(support && support[data.field]) {
                const field = support[data.field];
                if(field.toLowerCase().includes(data.searchInput)) {
                    results.push({
                        text: support.support_number,
                        component: 'Support',
                        type: `Support's ${data.field_name ? data.field_name : data.field}`,
                        path: `/support/show/${support.id}` 
                    })
                }
            }
            });
            return results;  
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

        createSupportTicketMessage({ commit }, supportData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/support/tickets/messages/create', supportData)
                    .then(res => {
                        commit('SET_NEW_SUPPORT_TICKET_MESSAGE', res.data.data);
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
