import axios from "axios";
import { serialize } from "object-to-formdata";

const TrainerState = {
    namespaced: true,

    state: {
        trainers: null,
    },

    getters: {
        trainers: state => state.trainers,
    },

    mutations: {
        SET_NEW_TRAINER(state, trainerData) {
            if(!state.trainers) {
                return;
            }

            state.trainers.unshift(trainerData);
        },

        SET_UPDATED_TRAINER(state, trainerData) {
            if(!state.trainers) {
                return;
            }
            
            const trainerIndex = state.trainers.findIndex(trainer => trainer.id === trainerData.id);
            if(trainerIndex < 0) {
                return;
            }
            
            trainerData.created_at = state.trainers[trainerIndex].created_at;
            state.trainers[trainerIndex] = trainerData;
        },

        SET_TRAINERS(state, trainers) {
            state.trainers = trainers;
        },

        DELETE_TRAINER(state, trainer_ids) {
            if(state.trainers) {
                state.trainers = state.trainers.filter(trainer => !trainer_ids.includes(trainer.id));
            }
        }
    },

    actions: {
        getTrainers({ commit, dispatch }) {
            return new Promise((resolve) => {
                commit('SET_TRAINERS', null);

                axios.get('cms/trainers')
                    .then(res => {
                        commit('SET_TRAINERS', res.data.data);
                    })
                    .catch(err => {
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to fetch Trainers',
                            type: 'error',
                        }, {root:true});
                        console.warn('getTrainers: ', err);
                    })
                    .finally(() => {
                        resolve()
                    })
            })
        },

        getTrainer({ state }, trainerID) {
            return new Promise((resolve) => {
                if(state.trainers) {
                    resolve(state.trainers.find(trainer => trainer.id == trainerID))
                } else {
                    resolve(null)
                }
            })
        },

        createTrainer({ commit }, trainerData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(trainerData, { indices: true });
                axios.post('cms/trainers/create', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_NEW_TRAINER', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createTrainer: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateTrainer({ commit }, trainerData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(trainerData, { indices: true });
                axios.post('cms/trainers/update', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_UPDATED_TRAINER', trainerData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateTrainer: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        deleteTrainers({ commit, dispatch }, trainer_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/trainers/delete', { ids: trainer_ids })
                    .then(() => {
                        commit('DELETE_TRAINER', trainer_ids);
                        dispatch('MessageState/addMessage', {
                            message: 'Trainer has been deleted successfully',
                        }, { root: true });
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteTrainer: ', err.response.data);
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to delete the trainer',
                        }, { root: true });
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default TrainerState;