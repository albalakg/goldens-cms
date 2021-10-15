<template>
    <div>
        <v-flex 
            class="toolbar_wrapper app_animation fixed"
            :class="sidebarIsOpen ? 'toolbar_wrapper_mini' : ''"
        >
            <v-card
                color="grey lighten-4"
                flat
                tile
            >
                <v-toolbar dense>
                <!-- <v-app-bar-nav-icon 
                    class="toolbar_menu ml-3"
                    @click="toggleSidebar()"
                ></v-app-bar-nav-icon> -->

                <v-spacer></v-spacer>

                <v-btn icon @click="toggleSearch()">
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>

                <v-menu
                    offset-y
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>

                    <v-list class="py-0">
                        <v-list-item
                            v-for="(item, i) in profile_items"
                            :key="i"
                            @click="goToItem(item)"
                        >   
                            
                            <v-list-item-title>
                                <v-flex d-flex align-center>
                                    <v-icon class="mr-5">
                                        {{item.icon}}
                                    </v-icon>
                                    <span>
                                        {{ item.text }}
                                    </span>
                                </v-flex>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                </v-toolbar>
            </v-card>
        </v-flex>
    </div>
</template>

<script>
export default {
    data() {
        return {
            profile_items: [
                {
                    text: 'Profile',
                    icon: 'mdi-account',
                    url: '/users/show/' + Auth.id(),
                },
                {
                    text: 'Logout',
                    icon: 'mdi-logout',
                    url: '/logout',
                },
            ]
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
        logout() {
            Auth.logout()
        },

        toggleSearch() {
            this.$store.dispatch('AppState/updateGlobalSearchState', true)
        },

        goToItem(item) {
            this.$router.push(item.url);
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