import axios from "axios";
import { serialize } from "object-to-formdata";

const EquipmentState = {
    namespaced: true,

    state: {
        equipment: null,
    },

    getters: {
        equipment: state => state.equipment,
    },

    mutations: {
        SET_NEW_EQUIPMENT(state, equipmentData) {
            if(!state.equipment) {
                return;
            }

            state.equipment.unshift(equipmentData);
        },

        SET_UPDATED_EQUIPMENT(state, equipmentData) {
            if(!state.equipment) {
                return;
            }
            
            const equipmentIndex = state.equipment.findIndex(equipment => equipment.id === equipmentData.id);
            if(equipmentIndex < 0) {
                return;
            }
            
            equipmentData.created_at = state.equipment[equipmentIndex].created_at;
            state.equipment[equipmentIndex] = equipmentData;
        },

        SET_EQUIPMENT(state, equipment) {
            state.equipment = equipment;
        },

        DELETE_EQUIPMENT(state, equipment_ids) {
            if(state.equipment) {
                state.equipment = state.equipment.filter(equipment => !equipment_ids.includes(equipment.id));
            }
        }
    },

    actions: {
        getEquipment({ commit, dispatch }) {
            return new Promise((resolve) => {

                commit('SET_EQUIPMENT', null);

                axios.get('cms/equipment')
                    .then(res => {
                        commit('SET_EQUIPMENT', res.data.data);
                    })
                    .catch(err => {
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to fetch Equipment',
                            type: 'error',
                        }, {root:true});
                        console.warn('getEquipment: ', err);
                    })
                    .finally(() => {
                        resolve()
                    })
            })
        },

        getSingleEquipment({ state }, equipmentID) {
            return new Promise((resolve) => {
                if(state.equipment) {
                    resolve(state.equipment.find(equipment => equipment.id == equipmentID))
                } else {
                    resolve(null)
                }
            })
        },

        createEquipment({ commit }, equipmentData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(equipmentData, { indices: true });
                axios.post('cms/equipment/create', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_NEW_EQUIPMENT', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createEquipment: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateEquipment({ commit }, equipmentData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(equipmentData, { indices: true });
                axios.post('cms/equipment/update', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_UPDATED_EQUIPMENT', equipmentData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateEquipment: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        deleteEquipment({ commit }, equipment_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/equipment/delete', { ids: equipment_ids })
                    .then(() => {
                        commit('DELETE_EQUIPMENT', equipment_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteEquipment: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default EquipmentState;