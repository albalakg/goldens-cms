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
            state.lessons = lessons.map(lesson => {
                return {
                    ...lesson,
                    tempDate: '',
                    date: lesson.schedule ? new Date(lesson.schedule.date) : ''
                }
            });
        },

        DELETE_LESSON(state, lesson_ids) {
            if(state.lessons) {
                state.lessons = state.lessons.filter(lesson => !lesson_ids.includes(lesson.id));
            }
        },

        ASSIGN_LESSONS(state, data) {
            state.lessons.forEach(lesson => {
                if(data.lessons.includes(lesson.id)) {
                    lesson.course_area_id   = data.courseArea.id;
                    lesson.course_id        = data.courseArea.course_id;
                }
            });
        },

        UNASSIGN_LESSONS(state, lessons) {
            state.lessons.forEach(lesson => {
                if(lessons.includes(lesson.id)) {
                    lesson.course_area_id   = null;
                    lesson.course_id        = null;
                }
            });
        },
    },

    actions: {
        getLessons({ commit, dispatch }) {
            return new Promise((resolve) => {
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
                    .finally(() => {
                        resolve()
                    })
            })
        },

        getLesson({ state }, lessonID) {
            return new Promise((resolve) => {
                if(state.lessons) {
                    resolve(state.lessons.find(lesson => lesson.id == lessonID))
                } else {
                    resolve(null)
                }
            })
        },
        
        async searchByName({dispatch}, searchInput) {
            return await dispatch('searchByInput', {searchInput, field: 'name', field_name: 'name'}); 
        },
                
        searchByInput({state}, data) {
            const results = [];
            state.lessons.forEach(lesson => {
            if(lesson && lesson[data.field]) {
                const field = lesson[data.field];
                if(field.toLowerCase().includes(data.searchInput)) {
                    const text = data.field === 'name' ? field : field + ` (${lesson.name})`;
                    results.push({
                        text: text,
                        component: 'Lesson',
                        type: `Lesson's ${data.field_name ? data.field_name : data.field}`,
                        path: `/content/lessons/show/${lesson.id}` 
                    })
                }
            }
            });
            return results;  
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
                const packageToSend = serialize(lessonData, { indices: true });
                axios.post('cms/lessons/update', packageToSend, FORM_DATA_CONFIG)
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
                    .then(() => {
                        commit('DELETE_LESSON', lesson_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteLesson: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateOrder({ dispatch }, lessons) {
            return new Promise((resolve, reject) => {
                axios.post('cms/lessons/order', {content: lessons})
                    .then(res => {
                        resolve(res.data);
                        dispatch('MessageState/addMessage', {
                            message: 'Updated the Lessons order successfully',
                        }, {root:true});
                    })
                    .catch(err => {
                        dispatch('MessageState/addMessage', {
                            message: 'Failed to update the Lessons order',
                            type: 'error',
                        }, {root:true});
                        console.warn('updateOrder: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        assignLessons({ commit }, data) {
            commit('ASSIGN_LESSONS', data);
        },

        unassignLessons({ commit }, lessons) {
            commit('UNASSIGN_LESSONS', lessons);
        },

    }
};

export default LessonState;
