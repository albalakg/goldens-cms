import axios from "axios";

const TestState = {
    namespaced: true,

    state: {
        tests: null,
    },

    getters: {
        tests: state => state.tests,
    },

    mutations: {
        SET_NEW_TEST(state, testData) {
            if(!state.tests) {
                return;
            }

            state.tests.unshift(testData);
        },

        SET_NEW_TEST_COMMENT(state, commentData) {
            if(!state.tests) {
                return;
            }

            const testIndex = state.tests.findIndex(test => test.id === commentData.user_course_submission_id);
            if(testIndex < 0) {
                return;
            }

            state.tests[testIndex].comments.unshift(commentData);
        },

        SET_UPDATED_STATUS(state, testData) {
            if(!state.tests) {
                return;
            }
            
            const testIndex = state.tests.findIndex(test => test.id === testData.id);
            if(testIndex < 0) {
                return;
            }
            
            state.tests[testIndex].status = testData.status;
        },

        SET_TESTS(state, tests) {
            state.tests = tests;
        },

        DELETE_TEST(state, test_ids) {
            if(state.tests) {
                state.tests = state.tests.filter(test => !test_ids.includes(test.id));
            }
        }
    },

    actions: {
        getTests({ commit, dispatch }) {
            commit('SET_TESTS', null);

            axios.get('cms/user-courses/tests')
                .then(res => {
                    commit('SET_TESTS', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Tests',
                        type: 'error',
                    }, {root:true});
                    console.warn('getTests: ', err);
                })
        },

        getTest({ state }, testID) {
            return new Promise((resolve, reject) => {
                if(state.tests) {
                    resolve(state.tests.find(test => test.id == testID))
                } else {
                    resolve(null)
                }
            })
        },

        createComment({ commit }, commentData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/user-courses/tests/comment/create', commentData)
                    .then(res => {
                        commit('SET_NEW_TEST_COMMENT', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createComment: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateStatus({ commit }, testData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/user-courses/tests/status/update', testData)
                    .then(res => {
                        commit('SET_UPDATED_STATUS', testData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateTest: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        deleteTests({ commit }, test_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/user-courses/tests/delete', { ids: test_ids })
                    .then(res => {
                        commit('DELETE_TEST', test_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteTest: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default TestState;
