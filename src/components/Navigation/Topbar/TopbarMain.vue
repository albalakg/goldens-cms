<template>
    <v-flex class="toolbar">
        
    </v-flex>
    <!-- <v-card
        color="grey lighten-4"
        flat
        height="200px"
        tile
    >
        <v-toolbar dense>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>{{name}}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
            <v-icon>mdi-heart</v-icon>
        </v-btn>

        <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
        </v-toolbar>
    </v-card> -->
</template>

<script>
export default {
    data() {
        return {

        }
    },

    computed: {
        name() {
            return this.$store.getters['AppState/appName'];
        }
    }
}
</script>

<style scoped>
</style>