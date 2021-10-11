import axios from "axios";

const PoliciesState = {
    namespaced: true,

    state: {
        cookies: null,
        terms_and_conditions: null,
    },

    getters: {
        cookies: state => state.cookies,
        terms_and_conditions: state => state.terms_and_conditions,
    },

    mutations: {
        SET_COOKIES(state, cookies) {
            state.cookies = cookies;
        },

        SET_TERMS_AND_CONDITIONS(state, terms_and_conditions) {
            state.terms_and_conditions = terms_and_conditions;
        },
    },

    actions: {
        getCookies({ state, commit, dispatch }) {
            if(state.cookies) {
                return;
            }

            axios.get('cms/policies/cookies')
                .then(res => {
                    commit('SET_COOKIES', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Cookies',
                        type: 'error',
                    }, {root:true});
                    console.warn('getCookies: ', err);
                })
        },

        getTermsAndConditions({ state, commit, dispatch }) {
            if(state.terms_and_conditions) {
                return;
            }

            axios.get('cms/policies/terms-and-conditions')
                .then(res => {
                    commit('SET_COOKIES', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Terms And Conditions',
                        type: 'error',
                    }, {root:true});
                    console.warn('getTermsAndConditions: ', err);
                })
        },
    }
};

export default PoliciesState;