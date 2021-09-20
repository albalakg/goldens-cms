import axios from "axios";
import { objectToFormData } from "object-to-formdata";

const CourseCategoryState = {
    namespaced: true,

    state: {
        courseCategories: null,
        totalCourseCategories: null,
    },

    getters: {
        courseCategories: state => state.courseCategories,
    },

    mutations: {
        SET_NEW_COURSE_CATEGORY(state, courseCategoryData) {
            if(!state.courseCategories) {
                return;
            }

            state.courseCategories.data.unshift(courseCategoryData);
        },

        SET_UPDATED_COURSE_CATEGORY(state, courseCategoryData) {
            if(!state.courseCategories) {
                return;
            }
            
            const courseCategoryIndex = state.courseCategories.data.findIndex(courseCategory => courseCategory.id === courseCategoryData.id);
            if(courseCategoryIndex < 0) {
                return;
            }

            courseCategoryData.email = state.courseCategories.data[courseCategoryIndex].email;
            courseCategoryData.created_at = state.courseCategories.data[courseCategoryIndex].created_at;
            courseCategoryData.full_name = courseCategoryData.first_name + ' ' + courseCategoryData.last_name;
            state.courseCategories.data[courseCategoryIndex] = {...courseCategoryData};
        },

        SET_UPDATED_COURSE_CATEGORY_EMAIL(state, courseCategoryData) {
            console.log('courseCategoryData', courseCategoryData);
            if(!state.courseCategories) {
                return;
            }

            const courseCategoryIndex = state.courseCategories.data.findIndex(courseCategory => courseCategory.id === courseCategoryData.id);
            console.log('courseCategoryIndex', courseCategoryIndex);
            if(courseCategoryIndex < 0) {
                return;
            }
            
            console.log('state.courseCategories.data[courseCategoryIndex]', state.courseCategories.data[courseCategoryIndex]);
            state.courseCategories.data[courseCategoryIndex].email = courseCategoryData.email;
        },

        SET_COURSE_CATEGORIES(state, courseCategories) {
            // add full name
            courseCategories.data = courseCategories.data.map(courseCategory => {
                courseCategory.full_name = courseCategory.first_name + ' ' + courseCategory.last_name;
                return courseCategory; 
            })

            state.courseCategories = courseCategories;
        },

        DELETE_COURSE_CATEGORY(state, courseCategory_ids) {
            if(state.courseCategories.data) {
                state.courseCategories.data = state.courseCategories.data.filter(courseCategory => !courseCategory_ids.includes(courseCategory.id));
            }
        }
    },

    actions: {
        getCourseCategories({ state, commit, dispatch }) {
            if(state.courseCategories) {
                return;
            }

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
                    resolve(state.courseCategories.data.find(courseCategory => courseCategory.id == courseCategoryID))
                } else {
                    resolve(null)
                }
            })
        },

        createCourseCategory({ commit }, courseCategoryData) {
            return new Promise((resolve, reject) => {
                const packageToSend = objectToFormData(courseCategoryData, { indices: true });
                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
                axios.post('cms/course-categories/create', packageToSend, config)
                    .then(res => {
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
                axios.post('cms/course-categories/update', courseCategoryData)
                    .then(res => {
                        commit('SET_UPDATED_COURSE_CATEGORY', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateCourseCategory: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        updateEmail({ commit }, courseCategoryData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/course-categories/update/email', courseCategoryData)
                    .then(res => {
                        commit('SET_UPDATED_COURSE_CATEGORY_EMAIL', courseCategoryData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateEmail: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        updatePassword({ commit }, courseCategoryData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/course-categories/update/password', courseCategoryData)
                    .then(res => {
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updatePassword: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        deleteCourseCategories({ commit }, courseCategory_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/course-categories/delete', { ids: courseCategory_ids })
                    .then(res => {
                        commit('DELETE_COURSE_CATEGORY', courseCategory_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteCourseCategory: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default CourseCategoryState;