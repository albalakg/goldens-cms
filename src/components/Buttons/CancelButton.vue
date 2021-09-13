<template>
    <v-btn
        :disabled="disabled"
        :loading="loading"
        :height="height"
        block
        :type="type"
        @click="submit()"
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
            default: 'Cancel'
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

        goBack: {
            type: Boolean
        }
    },

    methods: {
        submit() {
            if(this.goBack) {
                this.$router.go(-1);
            } else {
                this.$emit('submit');
            }
        }
    }
}
</script>