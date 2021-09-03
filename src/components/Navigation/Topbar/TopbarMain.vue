<template>
    <v-flex 
        class="toolbar_wrapper fixed"
        :class="sidebarIsOpen ? 'toolbar_wrapper_mini' : ''"
    >
        <v-card
            color="grey lighten-4"
            flat
            height="200px"
            tile
        >
            <v-toolbar dense>
            <v-app-bar-nav-icon 
                class="toolbar_menu"
                @click="toggleSidebar()"
            ></v-app-bar-nav-icon>

            <v-toolbar-title>{{name}}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
            </v-toolbar>
        </v-card>
    </v-flex>
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
        },

        sidebarIsOpen() {
            return this.$store.getters['AppState/sidebarState'];
        }
    },

    methods: {
        toggleSidebar() {
            this.$store.dispatch('AppState/updateSidebarState', !this.$store.getters['AppState/sidebarState'])
        }
    }
}
</script>

<style scoped>

    .toolbar_wrapper {
        margin-left: 5vw;
    }

    .toolbar_wrapper_mini {
        width: 100%;
        margin-left: 15vw;
    }

    .v-card {
        width: 95vw;
    }

    .toolbar_wrapper_mini .v-card {
        width: 85vw;
    }

    .toolbar_menu {
        margin-left: 20px;
        margin-right: 10px;
    }

</style>