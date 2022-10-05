import axios from "axios";
import { serialize } from "object-to-formdata";

const TermState = {
    namespaced: true,

    state: {
        terms: null,
    },

    getters: {
        terms: state => state.terms,
    },

    mutations: {
        SET_NEW_TERM(state, termData) {
            if(!state.terms) {
                return;
            }

            state.terms.unshift(termData);
        },

        SET_UPDATED_TERM(state, termData) {
            if(!state.terms) {
                return;
            }
            
            const termIndex = state.terms.findIndex(term => term.id === termData.id);
            if(termIndex < 0) {
                return;
            }
            
            termData.created_at = state.terms[termIndex].created_at;
            state.terms[termIndex] = termData;
        },

        SET_TERMS(state, terms) {
            state.terms = terms;
        },

        DELETE_TERM(state, term_ids) {
            if(state.terms) {
                state.terms = state.terms.filter(term => !term_ids.includes(term.id));
            }
        }
    },

    actions: {
        getTerms({ commit, dispatch }) {
            return new Promise((resolve) => {

                commit('SET_TERMS', null);

                axios.get('cms/terms')
                    .then(res => {
                        commit('SET_TERMS', res.data.data);
                    })
                    .catch(err => {
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to fetch Terms',
                            type: 'error',
                        }, {root:true});
                        console.warn('getTerms: ', err);
                    })
                    .finally(() => {
                        resolve()
                    })
            })
        },

        getTerm({ state }, termID) {
            return new Promise((resolve) => {
                if(state.terms) {
                    resolve(state.terms.find(term => term.id == termID))
                } else {
                    resolve(null)
                }
            })
        },

        createTerm({ commit }, termData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(termData, { indices: true });
                axios.post('cms/terms/create', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_NEW_TERM', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createTerm: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateTerm({ commit }, termData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(termData, { indices: true });
                axios.post('cms/terms/update', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_UPDATED_TERM', termData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateTerm: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        deleteTerms({ commit }, term_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/terms/delete', { ids: term_ids })
                    .then(() => {
                        commit('DELETE_TERM', term_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteTerm: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default TermState;