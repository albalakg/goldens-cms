<template>
    <v-container fluid class="user_show_wrapper">
        
        123

    </v-container>
</template>

<script>

export default {
    components: {
        
    },

    data() {
        return {
           
        }
    },

    created() {
       this.getUserChallenge()
    },

    computed: {
        
    },

    methods: {
        getUserChallenge() {
            this.$store.dispatch('')
        }
    }
}
</script>

<style scoped>

</style>