import axios from "axios";
import { serialize } from "object-to-formdata";

const TrainingOptionState = {
    namespaced: true,

    state: {
        trainingOptions: null,
    },

    getters: {
        trainingOptions: state => state.trainingOptions,
    },

    mutations: {
        SET_NEW_TRAINING_OPTION(state, trainingOptionData) {
            if(!state.trainingOptions) {
                return;
            }
            
            state.trainingOptions.unshift(trainingOptionData);
        },

        SET_UPDATED_TRAINING_OPTION(state, trainingOptionData) {
            if(!state.trainingOptions) {
                return;
            }
            
            const trainingOptionIndex = state.trainingOptions.findIndex(training_option => training_option.id === trainingOptionData.id);
            if(trainingOptionIndex < 0) {
                return;
            }
            
            trainingOptionData.created_at = state.trainingOptions[trainingOptionIndex].created_at;
            state.trainingOptions[trainingOptionIndex] = trainingOptionData;
        },

        SET_TRAINING_OPTIONS(state, trainingOptions) {
            state.trainingOptions = trainingOptions;
        },

        DELETE_TRAINING_OPTION(state, training_option_ids) {
            if(state.trainingOptions) {
                state.trainingOptions = state.trainingOptions.filter(training_option => !training_option_ids.includes(training_option.id));
            }
        }
    },

    actions: {
        getTrainingOptions({ commit, dispatch }) {
            return new Promise((resolve) => {

                commit('SET_TRAINING_OPTIONS', null);

                axios.get('cms/training-options')
                    .then(res => {
                        commit('SET_TRAINING_OPTIONS', res.data.data);
                    })
                    .catch(err => {
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to fetch Training Options',
                            type: 'error',
                        }, {root:true});
                        console.warn('getTrainingOptions: ', err);
                    })
                    .finally(() => {
                        resolve()
                    })
            })
        },

        getTrainingOption({ state }, training_optionID) {
            return new Promise((resolve) => {
                if(state.trainingOptions) {
                    resolve(state.trainingOptions.find(training_option => training_option.id == training_optionID))
                } else {
                    resolve(null)
                }
            })
        },

        createTrainingOption({ commit }, trainingOptionData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(trainingOptionData, { indices: true });
                axios.post('cms/training-options/create', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_NEW_TRAINING_OPTION', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createTrainingOption: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateTrainingOption({ commit }, trainingOptionData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(trainingOptionData, { indices: true });
                axios.post('cms/training-options/update', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_UPDATED_TRAINING_OPTION', trainingOptionData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateTrainingOption: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        deleteTrainingOptions({ commit }, training_option_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/training-options/delete', { ids: training_option_ids })
                    .then(() => {
                        commit('DELETE_TRAINING_OPTION', training_option_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteTrainingOption: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default TrainingOptionState;