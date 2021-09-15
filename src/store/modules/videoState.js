import axios from "axios";
import { objectToFormData } from "object-to-formdata";

const videoState = {
    namespaced: true,

    state: {
        videos: null,
        totalVideos: null,
    },

    getters: {
        videos: state => state.videos,
    },

    mutations: {
        SET_NEW_VIDEO(state, videoData) {
            if(!state.videos) {
                return;
            }

            state.videos.data.unshift(videoData);
        },

        SET_UPDATED_VIDEO(state, videoData) {
            if(!state.videos) {
                return;
            }
            
            const videoIndex = state.videos.data.findIndex(video => video.id === videoData.id);
            if(videoIndex < 0) {
                return;
            }

            videoData.email = state.videos.data[videoIndex].email;
            videoData.created_at = state.videos.data[videoIndex].created_at;
            videoData.full_name = videoData.first_name + ' ' + videoData.last_name;
            state.videos.data[videoIndex] = {...videoData};
        },

        SET_UPDATED_VIDEO_EMAIL(state, videoData) {
            console.log('videoData', videoData);
            if(!state.videos) {
                return;
            }

            const videoIndex = state.videos.data.findIndex(video => video.id === videoData.id);
            console.log('videoIndex', videoIndex);
            if(videoIndex < 0) {
                return;
            }
            
            console.log('state.videos.data[videoIndex]', state.videos.data[videoIndex]);
            state.videos.data[videoIndex].email = videoData.email;
        },

        SET_VIDEOS(state, videos) {
            // add full name
            videos.data = videos.data.map(video => {
                video.full_name = video.first_name + ' ' + video.last_name;
                return video; 
            })

            state.videos = videos;
        },

        DELETE_VIDEO(state, video_ids) {
            if(state.videos.data) {
                state.videos.data = state.videos.data.filter(video => !video_ids.includes(video.id));
            }
        }
    },

    actions: {
        getVideos({ state, commit, dispatch }) {
            if(state.videos) {
                return;
            }

            axios.get('cms/videos')
                .then(res => {
                    commit('SET_VIDEOS', res.data.data);
                })
                .catch(err => {
                    dispatch('MessageState/addMessage', {
                        message: 'Failed to fetch the videos',
                        type: 'error',
                    }, {root:true});
                    console.warn('getVideos: ', err);
                })
        },

        getVideo({ state }, videoID) {
            return new Promise((resolve, reject) => {
                if(state.videos) {
                    resolve(state.videos.data.find(video => video.id == videoID))
                } else {
                    resolve(null)
                }
            })
        },

        createVideo({ commit }, videoData) {
            return new Promise((resolve, reject) => {
                const packageToSend = objectToFormData(videoData, { indices: true });
                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
                axios.post('cms/videos/create', packageToSend, config)
                    .then(res => {
                        commit('SET_NEW_VIDEO', videoData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('createVideo: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },

        updateVideo({ commit }, videoData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/videos/update', videoData)
                    .then(res => {
                        commit('SET_UPDATED_VIDEO', res.data.data);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateVideo: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        updateEmail({ commit }, videoData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/videos/update/email', videoData)
                    .then(res => {
                        commit('SET_UPDATED_VIDEO_EMAIL', videoData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateEmail: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        updatePassword({ commit }, videoData) {
            return new Promise((resolve, reject) => {
                axios.post('cms/videos/update/password', videoData)
                    .then(res => {
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updatePassword: ', err);
                        reject(err.response.data)
                    })
            }) 
        },

        deleteVideos({ commit }, video_ids) {
            return new Promise((resolve, reject) => {
                axios.post('cms/videos/delete', { ids: video_ids })
                    .then(res => {
                        commit('DELETE_VIDEO', video_ids);
                        resolve();
                    })
                    .catch(err => {
                        console.warn('deleteVideo: ', err.response.data);
                        reject(err.response.data)
                    })
            }) 
        },
        
    }
};

export default videoState;