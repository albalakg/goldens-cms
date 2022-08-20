<template>
    <v-card class="px-3 w100 form_card_wrapper">
        <v-card-title v-if="title" primary-title>
            <v-flex>
                <v-flex d-flex justify-space-between align-center>
                    <p class="mb-0">
                        {{title}}
                    </p>
                    
                    <v-btn v-if="createable" class="ml-2" color="teal" dark fab small @click="add()">
                        <v-icon>mdi-plus-circle</v-icon>
                    </v-btn>
                </v-flex>
                <small>
                    {{subtitle}}
                </small>
            </v-flex>
        </v-card-title>
        <div v-else class="mt-7"></div>
        <slot name="content">

        </slot>
    </v-card>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        },
        
        subtitle: {
            type: String
        },

        createable: {
            type: Boolean
        },
    },
    
    methods: {
        add() {
            this.$emit('add')
        }
    }
}
</script>

<style scoped>

    .form_card_wrapper {
        border-left: 3px solid #0B032D;
    }

</style>