<template>
    <div 
        class="sidebar app_bg_darkBlue fixed"
        :class="isOpen ? '' : 'sidebar_closed'"
    >
        <div 
            class="sidebar_content"
        >
            
            <v-flex align-center justify-space-between class="sidebar_top_wrapper text-center" :class="isOpen ? '' : 'sidebar_top_wrapper_closed'">
                <h1 v-show="isOpen" class="logo white--text">
                    GOLDENS 
                </h1>
                
                <v-app-bar-nav-icon 
                    xLarge
                    dark
                    class="toolbar_menu ml-3"
                    @click="toggleSidebar()"
                ></v-app-bar-nav-icon>
            </v-flex>
            
            <div class="sidebar_links_wrapper mt-10">
                <template v-for="(link, index) in links">
                    <SidebarLink 
                        :key="index" 
                        :link="link" 
                    />
                </template>
            </div>

            <div class="sidebar_footer_profile">
                <div class="mt-2 pointer" @click="enterProfile()">
                    <strong>
                        {{
                            name
                        }}
                    </strong>
                    <br>
                    <small>
                        {{
                            role
                        }}
                    </small>
                </div>

                <v-icon @click="logout()" title="logout" class="pointer" color="white">mdi-logout</v-icon>
            </div>

        </div>

    </div>
</template>

<script>
import SidebarLink from './SidebarLink.vue';

export default {
    components: {
        SidebarLink
    },

    data() {
        return {
            drawer: true,
            links: [
                {
                    text: 'Dashboard',
                    url: '/',
                    icon: 'mdi-view-dashboard'
                },
                {
                    text: 'Users',
                    url: '/users',
                    icon: 'mdi-account-supervisor-circle',
                },
                {
                    text: 'Content',
                    url: '/content',
                    childrenUrl: '/content/courses',
                    icon: 'mdi-book-open-page-variant',
                    children: [
                        {
                            text: 'Courses',
                            url: '/content/courses',
                        },
                        {
                            text: 'Course Categories',
                            url: '/content/course-categories',
                        },
                        {
                            text: 'Course Areas',
                            url: '/content/course-areas',
                        },
                        {
                            text: 'Lessons',
                            url: '/content/lessons',
                        },
                        {
                            text: 'Videos',
                            url: '/content/videos',
                        },
                        {
                            text: 'Tests',
                            url: '/content/tests',
                        },
                    ]
                },
                {
                    text: 'Orders',
                    url: '/orders',
                    icon: 'mdi-cart',
                },
                {
                    text: 'Support',
                    url: '/support',
                    childrenUrl: '/support/tickets',
                    icon: 'mdi-face-agent',
                    children: [
                        {
                            text: 'Tickets',
                            url: '/support/tickets',
                        },
                        {
                            text: 'Categories',
                            url: '/support/categories',
                        }
                    ]
                },
                {
                    text: 'Policies',
                    url: '/policies',
                    childrenUrl: '/policies/terms-and-conditions',
                    icon: 'mdi-notebook-multiple',
                    children: [
                        {
                            text: 'Terms & Conditions',
                            url: '/policies/terms-and-conditions',
                        },
                        {
                            text: 'Cookies',
                            url: '/policies/cookies',
                        },
                    ]
                },
            ]
        }
    },

    computed: {
        isOpen() {
            return this.$store.getters['AppState/sidebarState'];
        },

        name() {
            return Auth.fullName()
        },

        role() {
            return Auth.role()
        },
    },

    methods: {
        toggleSidebar() {
            this.$store.dispatch('AppState/updateSidebarState', !this.$store.getters['AppState/sidebarState'])
        },

        logout() {
            this.$router.push('/logout');
        },

        enterProfile() {
            if(this.$route.path !== '/users/show/' + Auth.id()) {
                this.$router.push('/users/show/' + Auth.id())
            }
        }
    }
}
</script>

<style scoped lang="scss">

    .sidebar {
        height: 100vh;
        width: 15vw;
        min-width: 300px;
        z-index: 10;
    }

    .sidebar_top_wrapper {
        height: 48px;
        padding: 10px;
    }

    .sidebar_top_wrapper_closed > button{
        position: relative;
        left: -45px;
    }

    .sidebar_links_wrapper {
        height: calc(100vh - 146px);
        margin-top: 48px;
        border-radius: 10px 0 0 10px;
        padding: 20px;
        overflow-y: auto
    }

    .sidebar_footer_profile {
        color: #fff;
        position: relative;
        background-color: #ffffff1a;
        height: 58px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
    }

    .sidebar_footer_profile small {
        position: relative;
        top: -5px;
    }

    // .sidebar_content {
    //     height: calc(100vh - 96px);
    //     width: 90%;
    //     margin-left: 10%;
    //     margin-top: 48px;
    //     border-radius: 10px 0 0 10px;
    //     padding: 20px;
    //     overflow-y: auto
    // }

    // V2 design
    // Also change background-color to yellow
    // .sidebar_content {
        // height: 95vh;
        // width: 80%;
        // margin-left: 5%;
        // min-width: 300px;
        // margin-top: 2.5vh;
        // z-index: 2;
        // border-radius: 10px 10px;
        // box-shadow: 5px 5px 10px #00000088;
        // padding: 20px;
    // }

    .sidebar_closed {
        min-width: 95px !important;
        width: 5vw;

        .sidebar_content {
            min-width: 95px !important;
            margin-left: 30%;
            padding-left: 16px;
        }
    }
</style>