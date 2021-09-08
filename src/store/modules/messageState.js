const DEFAULT_MESSAGE_OPTIONS = {
    time: 5000,
    color: 'teal',
    message: 'Action finished successfully'
};

const COLORS = {
    error: 'red',
    info: 'teal'
};

let message_timeout = null;
let show_messages_interval = null;

const messageState = {
    namespaced: true,

    state: {
        messages_queue: [],
        options: {},
        status: false
    },

    getters: {
        options: state => state.options,
        status: state => state.status,
    },

    mutations: {
        ADD_MESSAGE(state, options) {
            state.messages_queue.push({
                time:       options && options.time        ? options.time          : DEFAULT_MESSAGE_OPTIONS.time,
                color:      options && options.type        ? COLORS[options.type]  : DEFAULT_MESSAGE_OPTIONS.color,
                message:    options && options.message     ? options.message       : DEFAULT_MESSAGE_OPTIONS.message,
            });
        },

        SET_MESSAGE(state) {
            if(!state.messages_queue.length) {
                return;
            }

            clearTimeout(message_timeout);

            state.options = {...state.messages_queue[0]};
            state.messages_queue.shift();
            state.status = true;

            message_timeout = setTimeout(() => {
                state.status = false;
            }, state.options.time)
        },

        SET_MESSAGE_OFF(state) {
            state.status = false;
        },
    },

    actions: {
        showMessage({ commit, dispatch }, options) {
            dispatch('messageQueueWorker');
            commit('ADD_MESSAGE', options)
        },

        messageQueueWorker({ state, commit }) {
            console.log('messageQueueWorker', show_messages_interval, state);
            if(!show_messages_interval) {
                show_messages_interval = setInterval(() => {
                    console.log('enter messageQueueWorker');
                    if(!state.messages_queue.length) {
                        clearTimeout(show_messages_interval);
                        return show_messages_interval = null;
                    }

                    if(state.status) {
                        return;
                    }

                    commit('SET_MESSAGE')    
                }, 1000);
            }
        },

        hideMessage({ commit }) {
            commit('SET_MESSAGE_OFF')
        },
    }
};

export default messageState;