<template>
    <div class="primary_message">
        <v-alert 
            dense 
            text
            border="left"
            :color="options.color" 
            :value="messageStatus"
            :timeout="options.time"
            transition="slide-y-transition"
        >
            {{options.message}}
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
        }
    },

    watch: {
        messageStatus() {
            console.log('messageStatus changed', this.messageStatus);
        }
    },

    methods: {
        toggle() {
            console.log('toggle');
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

</style>