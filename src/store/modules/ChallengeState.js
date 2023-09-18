import axios from "axios";
import { serialize } from "object-to-formdata";

const ChallengeState = {
    namespaced: true,

    state: {
        challenges: null,
        types: {
            1: '%',
            2: '₪'
        }
    },

    getters: {
        challenges: state => state.challenges,
    },

    mutations: {
        SET_NEW_CHALLENGE(state, challengeData) {
            if (!state.challenges) {
                state.challenges = [];
            }

            state.challenges.unshift(challengeData);
        },

        UPDATE_CHALLENGE(state, challengeData) {
            if (!state.challenges) {
                return;
            }

            const challengeIndex = state.challenges.findIndex(challenge => challenge.id === challengeData.id);
            if(challengeIndex !== -1) {
                state.challenges[challengeIndex] = challengeData;
            }
        },

        SET_CHALLENGES(state, challenges) {
            state.challenges = challenges;
        },

        DELETE_CHALLENGE(state, challenge_ids) {
            if (state.challenges) {
                state.challenges = state.challenges.filter(challenge => !challenge_ids.includes(challenge.id));
            }
        },
    },

    actions: {
        getChallenges({ commit, dispatch }) {
            return new Promise((resolve) => {

                commit('SET_CHALLENGES', null);

                axios.get('cms/challenges')
                    .then(res => {
                        commit('SET_CHALLENGES', res.data.data.map(challenge => {
                            challenge = {
                                ...challenge,
                                options: challenge.training_options
                            }
            
                            delete challenge.training_options;
                            return challenge;
                        }));
                    })
                    .catch(err => {
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to fetch Challenges',
                            type: 'error',
                        }, { root: true });
                        console.warn('getChallenges: ', err);
                    })
                    .finally(() => {
                        resolve()
                    })
            })
        },

        createChallenge({ commit }, challengeData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(challengeData, { indices: true });
                axios.post('cms/challenges/create', packageToSend, FORM_DATA_CONFIG)
                .then(res => {
                        commit('SET_NEW_CHALLENGE', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createChallenge: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateChallenge({ commit }, challengeData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(challengeData, { indices: true });
                axios.post('cms/challenges/update', packageToSend, FORM_DATA_CONFIG)
                .then(res => {
                        commit('UPDATE_CHALLENGE', challengeData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateChallenge: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        getChallenge({ state }, challengeID) {
            return new Promise((resolve) => {
                if (state.challenges) {
                    resolve(state.challenges.find(challenge => challenge.id == challengeID))
                } else {
                    resolve(null)
                }
            })
        },

        async searchByChallengeName({ dispatch }, searchInput) {
            return await dispatch('searchByInput', { searchInput, field: 'name', field_name: 'challenge name' });
        },

        searchByInput({ state }, data) {
            if (!state.challenges) {
                return;
            }

            const results = [];
            state.challenges.forEach(challenge => {
                if (challenge && challenge[data.field]) {
                    const field = challenge[data.field];
                    if (field.toLowerCase().includes(data.searchInput)) {
                        results.push({
                            text: challenge.challenge_number,
                            component: 'Challenge',
                            type: `Challenge's ${data.field_name ? data.field_name : data.field}`,
                            path: `/challenges/show/${challenge.id}`
                        })
                    }
                }
            });
            return results;
        }
    }
};

export default ChallengeState;
