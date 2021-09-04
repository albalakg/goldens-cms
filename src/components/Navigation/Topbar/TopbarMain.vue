<template>
    <v-flex 
        class="toolbar_wrapper fixed"
        :class="sidebarIsOpen ? 'toolbar_wrapper_mini' : ''"
    >
        <v-card
            color="grey lighten-4"
            flat
            tile
        >
            <v-toolbar dense>
            <v-app-bar-nav-icon 
                class="toolbar_menu ml-3"
                @click="toggleSidebar()"
            ></v-app-bar-nav-icon>

            <v-toolbar-title>{{name}}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-btn icon @click="logout()">
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
        },

        logout() {
            Auth.logout()
        }
    }
}
</script>

<style scoped>

    .toolbar_wrapper {
        margin-left: 5vw;
        z-index: 5;
    }

    .toolbar_wrapper_mini {
        z-index: 5;
        width: 100%;
        margin-left: 15vw;
    }

    .v-card {
        width: 95vw;
    }

    .toolbar_wrapper_mini .v-card {
        width: 85vw;
    }

    @media only screen and (max-width: 1700px) {
        .toolbar_menu {
            margin-left: 4vw !important;
        }
    }

    @media only screen and (max-width: 1400px) {
        .toolbar_menu {
            margin-left: 8vw !important;
        }
    }

</style>