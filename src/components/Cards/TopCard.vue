<template>
    <v-card class="py-2 px-5">
        <v-flex d-flex justify-space-between align-center>
            
            <v-flex d-flex align-center>
                <v-icon @click="reload()" v-if="reloadable" class="mr-2 pointer" color="black">mdi-reload</v-icon>

                <h1 class="font_title logo">
                    {{text}}
                </h1>

            </v-flex>

            <v-btn class="ml-2" v-if="createable" color="teal" dark fab small @click="create()">
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
        
        reloadable: {
            type: Boolean,
            default: true
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
        },

        reload() {
            this.$emit('reload');
        }
    }
    
}
</script>

<style scoped>
</style>