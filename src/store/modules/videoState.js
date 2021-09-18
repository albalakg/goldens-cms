import axios from "axios";
import { serialize } from "object-to-formdata";

const VideoState = {
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
            
            videoData.created_at = state.videos.data[videoIndex].created_at;
            state.videos.data[videoIndex] = videoData;
        },

        SET_VIDEOS(state, videos) {
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
                const packageToSend = serialize(videoData, { indices: true });
                axios.post('cms/videos/create', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_NEW_VIDEO', res.data.data);
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
                const packageToSend = serialize(videoData, { indices: true });
                axios.post('cms/videos/update', packageToSend, FORM_DATA_CONFIG)
                    .then(res => {
                        commit('SET_UPDATED_VIDEO', videoData);
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.warn('updateVideo: ', err);
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

export default VideoState;