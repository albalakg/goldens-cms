import axios from "axios";
import { serialize } from "object-to-formdata";

const TestState = {
    namespaced: true,

    state: {
        tests: null,
        totalTests: null,
    },

    getters: {
        tests: state => state.tests,
    },

    mutations: {
        SET_UPDATED_TEST(state, testData) {
            if(!state.tests) {
                return;
            }
            
            const testIndex = state.tests.data.findIndex(test => test.id === testData.id);
            if(testIndex < 0) {
                return;
            }
            
            testData.created_at = state.tests.data[testIndex].created_at;
            state.tests.data[testIndex] = testData;
        },

        SET_TESTS(state, tests) {
            state.tests = tests;
        },

        DELETE_TEST(state, test_ids) {
            if(state.tests.data) {
                state.tests.data = state.tests.data.filter(test => !test_ids.includes(test.id));
            }
        }
    },

    actions: {
        getTests({ state, commit, dispatch }) {
            if(state.tests) {
                return;
            }

            axios.get('cms/tests')
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
                    resolve(state.tests.data.find(test => test.id == testID))
                } else {
                    resolve(null)
                }
            })
        },

        updateTest({ commit }, testData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(testData, { indices: true });
                axios.post('cms/tests/update', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_UPDATED_TEST', testData);
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
                axios.post('cms/tests/delete', { ids: test_ids })
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