import axios from "axios";
import { serialize } from "object-to-formdata";

const CourseAreaState = {
    namespaced: true,

    state: {
        courseAreas: null,
    },

    getters: {
        courseAreas: state => state.courseAreas,
    },

    mutations: {
        SET_NEW_COURSE_AREA(state, courseAreaData) {
            if(!state.courseAreas) {
                return;
            }

            state.courseAreas.unshift(courseAreaData);
        },

        SET_UPDATED_COURSE_AREA(state, courseAreaData) {
            if(!state.courseAreas) {
                return;
            }
            
            const courseAreaIndex = state.courseAreas.findIndex(courseArea => courseArea.id === courseAreaData.id);
            if(courseAreaIndex < 0) {
                return;
            }

            courseAreaData.created_at = state.courseAreas[courseAreaIndex].created_at;
            state.courseAreas[courseAreaIndex] = {...courseAreaData};
        },

        SET_COURSE_AREAS(state, courseAreas) {
            console.log('SET_COURSE_AREAS', courseAreas);
            state.courseAreas = courseAreas;
        },

        DELETE_COURSE_AREA(state, courseArea_ids) {
            if(state.courseAreas) {
                state.courseAreas = state.courseAreas.filter(courseArea => !courseArea_ids.includes(courseArea.id));
            }
        }
    },

    actions: {
        getCourseAreas({ commit, dispatch }) {
            commit('SET_COURSE_AREAS', null);

            axios.get('cms/course-areas')
                .then(res => {
                    commit('SET_COURSE_AREAS', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch Course Areas',
                        type: 'error',
                    }, {root:true});
                    console.warn('getCourseAreas: ', err);
                })
        },

        getCourseArea({ state }, courseAreaID) {
            return new Promise((resolve, reject) => {
                if(state.courseAreas) {
                    resolve(state.courseAreas.find(courseArea => courseArea.id == courseAreaID))
                } else {
                    resolve(null)
                }
            })
        },

        createCourseArea({ commit }, courseAreaData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(courseAreaData, { indices: true });
                axios.post('cms/course-areas/create', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {

                        courseAreaData.id = res.data.data.id;
                        courseAreaData.created_at = res.data.data.created_at;
                        courseAreaData.status = res.data.data.status;
                        courseAreaData.course_category_name = res.data.data.category.name;
                        courseAreaData.lessons_count = 0;

                        commit('SET_NEW_COURSE_AREA', courseAreaData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createCourseArea: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateCourseArea({ commit }, courseAreaData) {
            return new Promise((resolve, reject) => {
                const packageToSend = serialize(courseAreaData, { indices: true });
                axios.post('cms/course-areas/update', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_UPDATED_COURSE_AREA', courseAreaData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateCourseArea: ', err);
                        reject(err.response.data)
                    })
            }) 
    },

        deleteCourseAreas({ commit, dispatch }, courseArea_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/course-areas/delete', { ids: courseArea_ids })
                    .then(res => {
                        commit('DELETE_COURSE_AREA', courseArea_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteCourseArea: ', err.response.data);
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

export default CourseAreaState;