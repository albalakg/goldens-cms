import axios from "axios";
import { serialize } from "object-to-formdata";

const CourseState = {
    namespaced: true,

    state: {
        courses: null,
        totalCourses: null,
    },

    getters: {
        courses: state => state.courses,
    },

    mutations: {
        SET_NEW_COURSE(state, courseData) {
            if(!state.courses) {
                return;
            }
            state.courses.data.unshift(courseData);
        },

        SET_UPDATED_COURSE(state, courseData) {
            if(!state.courses) {
                return;
            }
            
            const courseIndex = state.courses.data.findIndex(course => course.id === courseData.id);
            if(courseIndex < 0) {
                return;
            }

            courseData.created_at = state.courses.data[courseIndex].created_at;
            state.courses.data[courseIndex] = {...courseData};
        },

        SET_COURSES(state, courses) {
            state.courses = courses;
        },

        DELETE_COURSE(state, course_ids) {
            if(state.courses.data) {
                state.courses.data = state.courses.data.filter(course => !course_ids.includes(course.id));
            }
        }
    },

    actions: {
        getCourses({ state, commit, dispatch }) {
            if(state.courses) {
                return;
            }

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
                    resolve(state.courses.data.find(course => course.id == courseID))
                } else {
                    resolve(null)
                }
            })
        },

        createCourse({ commit }, courseData) {
            return new Promise((resolve, reject) => {
                try {
                    const packageToSend = serialize(courseData, { indices: true });
                    axios.post('cms/courses/create', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                            commit('SET_NEW_COURSE', courseData);
                            resolve(res.data);
                        })
                        .catch(err => {
                            console.warn('createCourse: ', err.response.data);
                            reject(err.response.data)
                        })
                } catch(er) {
                    console.log('er', er);
                }
            }) 
        },

        updateCourse({ commit }, courseData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/courses/update', courseData)
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

        deleteCourses({ commit }, course_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/courses/delete', { ids: course_ids })
                    .then(res => {
                        commit('DELETE_COURSE', course_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteCourse: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default CourseState;