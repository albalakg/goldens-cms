<template>
    <v-chip 
        dark
        :color="color"
    >
        {{text}}
    </v-chip>
</template>

<script>
import { STATUSES } from './../../helpers/Status'

export default {
    props: {
        status: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            colors: {
                0: 'red darken-2',
                1: 'green darken-2',
                2: 'teal',
            },
            texts: STATUSES  
        }
    },

    computed: {
        color() {
            try {
                if(!this.colors[this.status]) {
                    throw new Error('Color not found');
                }

                return this.colors[this.status];
            } catch(err) {
                console.warn(err);
                return 'red';
            }
        },

        text() {
            try {
                if(!this.texts[this.status]) {
                    throw new Error('Text not found');
                }

                return this.texts[this.status];
            } catch(err) {
                console.warn(err);
                return 'Error';
            }
        },
    }
}
</script>

<style scoped>
</style>