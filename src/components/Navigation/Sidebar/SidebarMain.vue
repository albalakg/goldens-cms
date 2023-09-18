<template>
    <div 
        class="sidebar app_animation app_bg_darkBlue fixed"
        :class="isOpen ? '' : 'sidebar_closed'"
    >
        <div 
            class="sidebar_content"
        >
            
            <v-flex align-center justify-space-between class="sidebar_top_wrapper text-center" :class="isOpen ? '' : 'sidebar_top_wrapper_closed'">
                <h1 :class="!isOpen ? 'logo_in_toolbar' : ''" class="logo">
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
                <v-flex d-flex align-center class="mt-2 pointer" @click="enterProfile()" :class="!isOpen ? 'justify-center' : ''">
                    <v-icon large color="white">mdi-face-man-profile</v-icon>
                    <div class="ml-3" v-show="isOpen">
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
                </v-flex>

                <v-icon v-show="isOpen" @click="logout()" title="logout" class="pointer" color="white">mdi-logout</v-icon>
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
                    icon: 'mdi-chart-bar'
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
                            icon: 'mdi-school',
                        },
                        {
                            text: 'Course Categories',
                            url: '/content/course-categories',
                            icon: 'mdi-book-multiple',
                        },
                        {
                            text: 'Course Areas',
                            url: '/content/course-areas',
                            icon: 'mdi-bookshelf',
                        },
                        {
                            text: 'Lessons',
                            url: '/content/lessons',
                            icon: 'mdi-book-open-variant',
                        },
                        {
                            text: 'Challenges',
                            url: '/content/challenges',
                            icon: 'mdi-trophy',
                        },
                        {
                            text: 'Videos',
                            url: '/content/videos',
                            icon: 'mdi-video-box',
                        },
                        {
                            text: 'Trainers',
                            url: '/content/trainers',
                            icon: 'mdi-account-tie',
                        },
                        {
                            text: 'Training Options',
                            url: '/content/training-options',
                            icon: 'mdi-tune-vertical',
                        },
                        {
                            text: 'Skills',
                            url: '/content/skills',
                            icon: 'mdi-trophy-variant',
                        },
                        {
                            text: 'Equipment',
                            url: '/content/equipment',
                            icon: 'mdi-traffic-cone',
                        },
                        {
                            text: 'Terms',
                            url: '/content/terms',
                            icon: 'mdi-file-document',
                        },
                        {
                            text: 'Marketing',
                            url: '/content/marketings',
                            icon: 'mdi-cash-multiple',
                        },
                        // {
                        //     text: 'Tests',
                        //     url: '/content/tests',
                        //     icon: 'mdi-notebook-edit-outline',
                        // },
                        {
                            text: 'Coupons',
                            url: '/content/coupons',
                            icon: 'mdi-ticket-percent',
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
                            icon: 'mdi-ticket-confirmation',
                        },
                        {
                            text: 'Categories',
                            url: '/support/categories',
                            icon: 'mdi-book-multiple',
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
                            icon: 'mdi-book-information-variant',
                        },
                        {
                            text: 'Cookies',
                            url: '/policies/cookies',
                            icon: 'mdi-cookie-settings',
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
    }

    .sidebar_links_wrapper {
        height: calc(100vh - 146px);
        margin-top: 48px;
        border-radius: 10px 0 0 10px;
        padding: 20px;
        overflow-y: auto;
        overflow-x: hidden;
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

    .sidebar_closed {
        min-width: 95px !important;
        width: 5vw;

        .sidebar_content {
            min-width: 95px !important;
        }
    }

    .logo {
        color: #fff;
        transition: .2s all linear;
    }

    .logo_in_toolbar {
        transform: translateX(135px);
        color: #060218;
        z-index: 1000;
        position: absolute;
    }
</style>