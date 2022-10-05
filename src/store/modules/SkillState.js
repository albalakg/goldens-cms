import axios from "axios";
import { serialize } from "object-to-formdata";

const SkillState = {
    namespaced: true,

    state: {
        skills: null,
    },

    getters: {
        skills: state => state.skills,
    },

    mutations: {
        SET_NEW_SKILL(state, skillData) {
            if(!state.skills) {
                return;
            }

            state.skills.unshift(skillData);
        },

        SET_UPDATED_SKILL(state, skillData) {
            console.log('SET_UPDATED_SKILL', skillData);
            if(!state.skills) {
                return;
            }
            
            const skillIndex = state.skills.findIndex(skill => skill.id === skillData.id);
            if(skillIndex < 0) {
                return;
            }
            
            skillData.created_at = state.skills[skillIndex].created_at;
            state.skills[skillIndex] = skillData;
        },

        SET_SKILLS(state, skills) {
            state.skills = skills;
        },

        DELETE_SKILL(state, skill_ids) {
            if(state.skills) {
                state.skills = state.skills.filter(skill => !skill_ids.includes(skill.id));
            }
        }
    },

    actions: {
        getSkills({ commit, dispatch }) {
            return new Promise((resolve) => {

                commit('SET_SKILLS', null);

                axios.get('cms/skills')
                    .then(res => {
                        commit('SET_SKILLS', res.data.data);
                    })
                    .catch(err => {
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to fetch Skills',
                            type: 'error',
                        }, {root:true});
                        console.warn('getSkills: ', err);
                    })
                    .finally(() => {
                        resolve()
                    })
            })
        },

        getSkill({ state }, skillID) {
            return new Promise((resolve) => {
                if(state.skills) {
                    resolve(state.skills.find(skill => skill.id == skillID))
                } else {
                    resolve(null)
                }
            })
        },

        createSkill({ commit }, skillData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(skillData, { indices: true });
                axios.post('cms/skills/create', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_NEW_SKILL', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createSkill: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateSkill({ commit }, skillData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(skillData, { indices: true });
                axios.post('cms/skills/update', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_UPDATED_SKILL', skillData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateSkill: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        deleteSkills({ commit }, skill_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/skills/delete', { ids: skill_ids })
                    .then(() => {
                        commit('DELETE_SKILL', skill_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteSkill: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default SkillState;