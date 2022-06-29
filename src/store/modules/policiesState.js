import axios from "axios";

const PoliciesState = {
    namespaced: true,

    state: {
        cookies: null,
        termsAndConditions: null,
    },

    getters: {
        cookies: state => state.cookies,
        termsAndConditions: state => state.termsAndConditions,
    },

    mutations: {
        SET_COOKIES(state, cookies) {
            state.cookies = cookies;
        },

        SET_TERMS_AND_CONDITIONS(state, termsAndConditions) {
            state.termsAndConditions = termsAndConditions;
        },

        SET_NEW_TERMS_AND_CONDITIONS(state, data) {
            if(!state.termsAndConditions) {
                return;
            }

            state.termsAndConditions.unshift(data);
        }
    },

    actions: {
        getCookies({ state, commit, dispatch }) {
            return new Promise((resolve) => {

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
                    .finally(() => {
                        resolve()
                    })
            })
        },

        getTermsAndConditions({ state, commit, dispatch }) {
            if(state.termsAndConditions) {
                return;
            }

            axios.get('cms/policies/terms-and-conditions')
                .then(res => {
                    commit('SET_TERMS_AND_CONDITIONS', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Terms And Conditions',
                        type: 'error',
                    }, {root:true});
                    console.warn('getTermsAndConditions: ', err);
                })
        },

        createTermsAndConditions({ commit }, dataToSend) {
            return new Promise((resolve, reject) => {
                axios.post('cms/policies/terms-and-conditions/create', dataToSend)
                    .then(res => {
                        commit('SET_NEW_TERMS_AND_CONDITIONS', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createTermsAndConditions: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },
    }
};

export default PoliciesState;
