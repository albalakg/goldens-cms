import axios from "axios";
import { serialize } from "object-to-formdata";

const CourseCategoryState = {
    namespaced: true,

    state: {
        courseCategories: null,
    },

    getters: {
        courseCategories: state => state.courseCategories,
    },

    mutations: {
        SET_NEW_COURSE_CATEGORY(state, courseCategoryData) {
            if(!state.courseCategories) {
                return;
            }

            state.courseCategories.unshift(courseCategoryData);
        },

        SET_UPDATED_COURSE_CATEGORY(state, courseCategoryData) {
            if(!state.courseCategories) {
                return;
            }
            
            const courseCategoryIndex = state.courseCategories.findIndex(courseCategory => courseCategory.id === courseCategoryData.id);
            if(courseCategoryIndex < 0) {
                return;
            }

            courseCategoryData.created_at = state.courseCategories[courseCategoryIndex].created_at;
            state.courseCategories[courseCategoryIndex] = {...courseCategoryData};
        },

        SET_COURSE_CATEGORIES(state, courseCategories) {
            state.courseCategories = courseCategories;
        },

        DELETE_COURSE_CATEGORY(state, courseCategory_ids) {
            if(state.courseCategories) {
                state.courseCategories = state.courseCategories.filter(courseCategory => !courseCategory_ids.includes(courseCategory.id));
            }
        }
    },

    actions: {
        getCourseCategories({ commit, dispatch }) {
            commit('SET_COURSE_CATEGORIES', null);

            axios.get('cms/course-categories')
                .then(res => {
                    commit('SET_COURSE_CATEGORIES', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Course Categories',
                        type: 'error',
                    }, {root:true});
                    console.warn('getCourseCategories: ', err);
                })
        },

        getCourseCategory({ state }, courseCategoryID) {
            return new Promise((resolve, reject) => {
                if(state.courseCategories) {
                    resolve(state.courseCategories.find(courseCategory => courseCategory.id == courseCategoryID))
                } else {
                    resolve(null)
                }
            })
        },

        createCourseCategory({ commit }, courseCategoryData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(courseCategoryData, { indices: true });
                axios.post('cms/course-categories/create', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {

                        courseCategoryData.id = res.data.data.id;
                        courseCategoryData.created_at = res.data.data.created_at;
                        courseCategoryData.status = res.data.data.status;
                        courseCategoryData.courses_count = 0;

                        commit('SET_NEW_COURSE_CATEGORY', courseCategoryData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createCourseCategory: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateCourseCategory({ commit }, courseCategoryData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(courseCategoryData, { indices: true });
                axios.post('cms/course-categories/update', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_UPDATED_COURSE_CATEGORY', courseCategoryData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateCourseCategory: ', err);
                        reject(err.response.data)
                    })
            }) 
    },

        deleteCourseCategories({ commit, dispatch }, courseCategory_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/course-categories/delete', { ids: courseCategory_ids })
                    .then(res => {
                        commit('DELETE_COURSE_CATEGORY', courseCategory_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteCourseCategory: ', err.response.data);
                        dispatch('MessageState/addMessage', {
                            message: err.response.data.message,
                            type: 'error',
                        }, {root:true});
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default CourseCategoryState;