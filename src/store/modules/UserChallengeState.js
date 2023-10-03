import axios from "axios";

const UserChallengeState = {
    namespaced: true,

    state: {
        user_challenges: null,
    },

    getters: {
        user_challenges: state => state.user_challenges,
    },

    mutations: {
        SET_USERS_CHALLENGES(state, user_challenges) {
            state.user_challenges = user_challenges;
        },

        ADD_CHALLENGE_TO_USER(state, user_challenge) {
            user_challenge.finished_lessons_count = 0;
            state.user_challenges.unshift(user_challenge);
        },

        DELETE_USER_CHALLENGES(state, ids) {
            if(state.user_challenges) {
                state.user_challenges = state.user_challenges.filter(user_challenge => !ids.includes(user_challenge.id));
            }
        },

        SET_USER_CHALLENGE_PROGRESS(state, data) {
            state.user_challenges.forEach(item => {
                if(item.id === data.id) {
                    item.progress = data.progress;
                }
            })
        }
    },

    actions: {
        getUsersChallenges({ commit, dispatch }) {
            return new Promise((resolve) => {

                commit('SET_USERS_CHALLENGES', null);

                axios.get('cms/user-challenges')
                    .then(res => {
                        commit('SET_USERS_CHALLENGES', res.data.data);
                    })
                    .catch(err => {
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to fetch Challenges',
                            type: 'error',
                        }, {root:true});
                        console.warn('getChallenges: ', err);
                    })
                    .finally(() => {
                        resolve()
                    })
            })
        },

        getUserChallengeProgress({ state, commit, dispatch }, userChallengeID) {
            const userChallenge = state.user_challenges.find(item => item.id === Number(userChallengeID));
            if(userChallenge && userChallenge.progress) {
                return;
            }

            axios.get('cms/user-challenges/progress/' + userChallengeID)
                .then(res => {
                    commit('SET_USER_CHALLENGE_PROGRESS', {id: userChallengeID, progress: res.data.data});
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Challenges',
                        type: 'error',
                    }, {root:true});
                    console.warn('getChallenges: ', err);
                })
        },

        delete({ commit, dispatch, state }, ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/user-challenges/delete', { ids })
                    .then(() => {
                        let deleteMessage = `${ids.length} Users Challenges has been deleted successfully`
                        if(ids.length === 1) {
                            const deletedChallengeUser = state.user_challenges.find(user_challenge => user_challenge.id === ids[0]);
                            deleteMessage = `User Challenge for ${deletedChallengeUser.full_name ?? deletedChallengeUser.challenge_name} has been deleted successfully`;
                        }

                        dispatch('MessageState/addMessage', {
                            message: deleteMessage
                        }, { root: true });

                        commit('DELETE_USER_CHALLENGES', ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteChallenge: ', err);
                        dispatch('MessageState/addMessage', {
                            message: err.response.data.message,
                            type: 'error',
                        }, {root:true});
                        reject(err.response.data)
                    })
            }) 
        },

        getById({ state }, id) {
            return new Promise((resolve) => {
                if(state.user_challenges) {
                    const data = state.user_challenges.find(item => item.id === Number(id))
                    resolve(data);
                }
            })
        },

        getByUser({ state }, user_id) {
            return new Promise((resolve) => {
                if(state.user_challenges) {
                    const data = state.user_challenges.filter(item => item.user_id === Number(user_id))
                    resolve(data);
                }
            })
        },

        getByChallenge({ state }, challenge_id) {
            return new Promise((resolve) => {
                if(state.user_challenges) {
                    const data = state.user_challenges.filter(item => item.challenge_id === Number(challenge_id))
                    resolve(data);
                }
            })
        },
    }
};

export default UserChallengeState;
