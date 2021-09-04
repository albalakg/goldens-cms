<template>
    <v-btn
        :disabled="disabled"
        :loading="loading"
        :height="height"
        block
        :type="type"
        @click="submit()"
        dark
        color="purple darken-4"
    >
        <slot name="content">
        </slot>
        <strong>
            {{text}}
        </strong>
    </v-btn>
</template>

<script>
export default {
    
    props: {
        text: {
            type: String,
            default: 'Submit'
        },

        type: {
            type: String,
            default: 'button',
        },

        loading: {
            type: Boolean,
        },

        disabled: {
            type: Boolean,
        },

        color: {
            type: String,
        },

        height: {
            type: Number,
            default: 50
        },
    },

    methods: {
        submit() {
            this.$emit('submit');
        }
    }
}
</script>