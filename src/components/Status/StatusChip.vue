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
        },
        customText: {
            type: Array
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
                return this.colors[0];
            }
        },

        text() {
            try {
                if(this.customText ? !this.customText[this.status] : !this.texts[this.status]) {
                    throw new Error('Text not found for status: ' + this.status);
                }

                return this.customText ? this.customText[this.status] : this.texts[this.status];
            } catch(err) {
                console.warn(err);
                return 'Unknown';
            }
        },
    }
}
</script>

<style scoped>
</style>