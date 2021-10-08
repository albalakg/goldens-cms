import axios from "axios";

const UserCourseState = {
    namespaced: true,

    state: {
        users_courses: null,
    },

    getters: {
        users_courses: state => state.users_courses,
    },

    mutations: {
        SET_USERS_COURSES(state, users_courses) {
            state.users_courses = users_courses;
        },

        ADD_COURSE_TO_USER(state, user_course) {
            user_course.finished_lessons_count = 0;
            state.users_courses.unshift(user_course);
        },

        SET_USER_COURSE_PROGRESS(state, data) {
            state.users_courses.forEach(item => {
                if(item.id === data.id) {
                    item.progress = data.progress;
                }
            })
        }
    },

    actions: {
        getUsersCourses({ state, commit, dispatch }) {
            if(state.users_courses) {
                return;
            }

            axios.get('cms/user-courses')
                .then(res => {
                    commit('SET_USERS_COURSES', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Courses',
                        type: 'error',
                    }, {root:true});
                    console.warn('getCourses: ', err);
                })
        },

        getUserCourseProgress({ state, commit, dispatch }, userCourseID) {
            const userCourse = state.users_courses.find(item => item.id === Number(userCourseID));
            if(userCourse && userCourse.progress) {
                return;
            }

            axios.get('cms/user-courses/progress/' + userCourseID)
                .then(res => {
                    commit('SET_USER_COURSE_PROGRESS', {id: userCourseID, progress: res.data.data});
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Courses',
                        type: 'error',
                    }, {root:true});
                    console.warn('getCourses: ', err);
                })
        },

        addCourseToUser({ state, commit, dispatch }, data) {
            return new Promise((resolve, reject) => {
                axios.post('cms/user-courses/add', data)
                    .then(res => {
                        dispatch('MessageState/addMessage', {
                            message: 'Added course successfully to user',
                        }, {root:true});
                        commit('ADD_COURSE_TO_USER', res.data.data);
                    })
                    .catch(err => {
                        dispatch('MessageState/addMessage', {
                            message: err.response.data && err.response.data.message ? err.response.data.message : 'Failed to add course to user',
                            type: 'error',
                        }, {root:true});
                        console.warn('getCourses: ', err);
                    })
                    .finally(() => {
                        resolve();
                    })
            })
        },

        getById({ state }, id) {
            return new Promise((resolve) => {
                if(state.users_courses) {
                    const data = state.users_courses.find(item => item.id === Number(id))
                    resolve(data);
                }
            })
        },

        getByUser({ state }, user_id) {
            return new Promise((resolve) => {
                if(state.users_courses) {
                    const data = state.users_courses.filter(item => item.user_id === Number(user_id))
                    resolve(data);
                }
            })
        },

        getByCourse({ state }, course_id) {
            return new Promise((resolve) => {
                if(state.users_courses) {
                    const data = state.users_courses.filter(item => item.course_id === Number(course_id))
                    resolve(data);
                }
            })
        },
    }
};

export default UserCourseState;