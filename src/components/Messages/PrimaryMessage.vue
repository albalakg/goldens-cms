<template>
    <div 
        class="primary_message"
        :class="sidebarIsOpen ? 'sidebar_open' : ''"
    >
        <v-alert 
            dense 
            text
            border="left"
            :color="options.color" 
            :value="messageStatus"
            :timeout="options.time"
            transition="slide-y-transition"
        >
        <v-flex d-flex justify-space-between align-center>
            <span>
                {{options.message}}
            </span>
            <div 
                v-show="messages_counter" 
                class="message_counter pointer"
                :title="`Close ${messages_counter} messages in queue`"
                @click="truncateMessages()"
            >
                <span >
                    {{messages_counter > 9 ? '9+' : messages_counter}}
                </span>
            </div>
        </v-flex>
        </v-alert>
    </div>
</template>

<script>
export default {
    computed: {
        messageStatus() {
            return this.$store.getters['MessageState/status'];
        },

        options() {
            return this.$store.getters['MessageState/options'];
        },

        messages_counter() {
            return this.$store.getters['MessageState/messages_in_queue'].length
        },
        
        sidebarIsOpen() {
            return this.$store.getters['AppState/sidebarState'];
        },
    },


    methods: {
        truncateMessages() {
            this.$store.dispatch('MessageState/truncate');
        }
    }
}
</script>

<style scoped>

    .primary_message {
        position: fixed;
        top: 4px;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 5;
        width: 50%;
    }

    .message_counter {
        padding: 0px;
        background-color: #00000022;
        border-radius: 50%;
        height: 25px;
        width: 25px;
        display: flex;
        justify-content: center;
    }

    .sidebar_open {
        left: 15vw;
    }
    
</style>