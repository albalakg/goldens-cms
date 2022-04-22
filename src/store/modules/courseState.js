import axios from "axios";
import { serialize } from "object-to-formdata";

const CourseState = {
    namespaced: true,

    state: {
        courses: null,
    },

    getters: {
        courses: state => state.courses,
    },

    mutations: {
        SET_NEW_COURSE(state, courseData) {
            if(!state.courses) {
                return;
            }
            state.courses.unshift(courseData);
        },

        SET_UPDATED_COURSE(state, courseData) {
            if(!state.courses) {
                return;
            }
            
            const courseIndex = state.courses.findIndex(course => course.id === courseData.id);
            if(courseIndex < 0) {
                return;
            }

            courseData.created_at = state.courses[courseIndex].created_at;
            state.courses[courseIndex] = {...courseData};
        },

        SET_COURSES(state, courses) {
            state.courses = courses;
        },

        DELETE_COURSE(state, course_ids) {
            if(state.courses) {
                state.courses = state.courses.filter(course => !course_ids.includes(course.id));
            }
        }
    },

    actions: {
        getCourses({ commit, dispatch }) {
            commit('SET_COURSES', null);

            axios.get('cms/courses')
                .then(res => {
                    commit('SET_COURSES', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Courses',
                        type: 'error',
                    }, {root:true});
                    console.warn('getCourses: ', err);
                })
        },

        getCourse({ state }, courseID) {
            return new Promise((resolve, reject) => {
                if(state.courses) {
                    resolve(state.courses.find(course => course.id == courseID))
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
            state.courses.forEach(course => {
            if(course && course[data.field]) {
                const field = course[data.field];
                if(field.toLowerCase().includes(data.searchInput)) {
                    const text = data.field === 'name' ? field : field + ` (${course.name})`;
                    results.push({
                        text: text,
                        component: 'Course',
                        type: `Course's ${data.field_name ? data.field_name : data.field}`,
                        path: `/content/courses/show/${course.id}` 
                    })
                }
            }
            });
            return results;  
        },

        createCourse({ commit }, courseData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(courseData, { indices: true });
                axios.post('cms/courses/create', packageToSend, FORM_DATA_CONFIG)
                .then(res => {
                        commit('SET_NEW_COURSE', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createCourse: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateCourse({ commit }, courseData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(courseData, { indices: true });
                    axios.post('cms/courses/update', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_UPDATED_COURSE', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateCourse: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        deleteCourses({ commit, dispatch }, course_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/courses/delete', { ids: course_ids })
                    .then(res => {
                        commit('DELETE_COURSE', course_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteCourse: ', err.response.data);
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

export default CourseState;