/* eslint-disable no-empty-pattern */
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
        SET_NEW_COURSE_RECOMMENDATIONS(state, courseRecommendations) {
            state.courses = state.courses.map(course => {
                if(course.id === courseRecommendations[0].course_id) {
                    course.recommendations = course.recommendations.concat(courseRecommendations)
                }

                return course;
            })
        },

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
        },

        DELETE_COURSE_RECOMMENDATIONS(state, data) {
            if(state.courses) {
                state.courses = state.courses.map(course => {
                    if(course.id == data.courseId) {
                        course.recommendations = course.recommendations.filter(recommendation => !data.recommendationIds.includes(recommendation.id))
                    }

                    return course;
                });
            }
        },
        
        SET_LESSON_SCHEDULE(state, lessonSchedule) {
            const courseIndex = state.courses.findIndex(course => course.id === lessonSchedule.courseId);
            if(courseIndex === -1) {
                return;
            }

            const scheduleIndex = state.courses[courseIndex].schedules.findIndex(schedule => lessonSchedule.course_lesson_id === schedule.course_lesson_id);
            if(scheduleIndex !== -1) {
                state.courses[courseIndex].schedules[scheduleIndex] = lessonSchedule;
            } else {
                state.courses[courseIndex].schedules.push(lessonSchedule);
            }
        },
        
        SET_TRAINING_SCHEDULE(state, trainingSchedule) {
            const courseIndex = state.courses.findIndex(course => course.id === trainingSchedule.courseId);
            if(courseIndex === -1) {
                return;
            }

            state.courses[courseIndex].schedules.push(trainingSchedule);
        },
    },

    actions: {
        getCourses({ commit, dispatch }) {
            return new Promise((resolve) => {

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
                    .finally(() => {
                        resolve()
                    })
            })
        },

        getCourse({ state }, courseID) {
            return new Promise((resolve) => {
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

        createCourseRecommendations({ commit }, courseData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/courses/recommendations/create', courseData)
                .then(res => {
                        commit('SET_NEW_COURSE_RECOMMENDATIONS', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createCourse: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
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
                    .then(() => {
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

        deleteCourseRecommendations({ commit, dispatch }, data) {
            return new Promise((resolve, reject) => {
                axios.post('cms/courses/recommendations/delete', { ids: data.recommendationIds })
                    .then(() => {
                        commit('DELETE_COURSE_RECOMMENDATIONS', data);
                        dispatch('MessageState/addMessage', {
                            message: 'Course schedule saved successfully',
                        }, {root:true});
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteCourseRecommendations: ', err);
                        
                        reject(err.response.data)
                    })
            }) 
        },
        
        setLessonSchedule({ commit }, schedule) {
            commit('SET_LESSON_SCHEDULE', schedule);
        },

        setTrainingSchedule({ commit }, schedule) {
            commit('SET_TRAINING_SCHEDULE', schedule);
        },

        saveCourseSchedule({}, data) {
            return new Promise((resolve) => {
                axios.post('cms/courses/schedule', data)
                    .then(() => {
                        resolve();
                    })
                    .catch(err => {
                        console.warn('saveCourseSchedule: ', err);
                        resolve()
                    })
            }) 
        },
        
    }
};

export default CourseState;