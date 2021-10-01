<template>
    <v-card class="py-2 px-5">
        <v-flex d-flex justify-space-between align-center>
            <h1 class="font_title">
                {{text}}
            </h1>
            <v-btn v-if="createable" color="teal" dark fab small @click="create()">
                <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
        </v-flex>
    </v-card>
</template>

<script>
export default {

    props: {
        text: {
            type: String,
            required: true
        },
        
        createable: {
            type: Boolean
        },
        
        createLink: {
            type: String,
        }
    },

    methods: {
        create() {
            if(this.createLink) {
                return this.$router.push(this.createLink);
            }

            this.$router.push(this.$route.path + '/new');
        }
    }
    
}
</script>

<style scoped>
</style>