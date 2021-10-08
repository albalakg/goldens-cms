import axios from "axios";
import { serialize } from "object-to-formdata";

const LessonState = {
    namespaced: true,

    state: {
        lessons: null,
    },

    getters: {
        lessons: state => state.lessons,
    },

    mutations: {
        SET_NEW_LESSON(state, lessonData) {
            if(!state.lessons) {
                return;
            }

            state.lessons.unshift(lessonData);
        },

        SET_UPDATED_LESSON(state, lessonData) {
            if(!state.lessons) {
                return;
            }
            
            const lessonIndex = state.lessons.findIndex(lesson => lesson.id === lessonData.id);
            if(lessonIndex < 0) {
                return;
            }

            lessonData.created_at = state.lessons[lessonIndex].created_at;
            state.lessons[lessonIndex] = {...lessonData};
        },

        SET_LESSONS(state, lessons) {
            state.lessons = lessons;
        },

        DELETE_LESSON(state, lesson_ids) {
            if(state.lessons) {
                state.lessons = state.lessons.filter(lesson => !lesson_ids.includes(lesson.id));
            }
        }
    },

    actions: {
        getLessons({ state, commit, dispatch }) {
            if(state.lessons) {
                return;
            }

            axios.get('cms/lessons')
                .then(res => {
                    commit('SET_LESSONS', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Lessons',
                        type: 'error',
                    }, {root:true});
                    console.warn('getLessons: ', err);
                })
        },

        getLesson({ state }, lessonID) {
            return new Promise((resolve, reject) => {
                if(state.lessons) {
                    resolve(state.lessons.find(lesson => lesson.id == lessonID))
                } else {
                    resolve(null)
                }
            })
        },

        createLesson({ commit }, lessonData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(lessonData, { indices: true });
                axios.post('cms/lessons/create', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_NEW_LESSON', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createLesson: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateLesson({ commit }, lessonData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/lessons/update', lessonData)
                    .then(res => {
                        commit('SET_UPDATED_LESSON', lessonData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateLesson: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        deleteLessons({ commit }, lesson_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/lessons/delete', { ids: lesson_ids })
                    .then(res => {
                        commit('DELETE_LESSON', lesson_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteLesson: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default LessonState;