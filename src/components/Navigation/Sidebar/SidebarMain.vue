<template>
    <div 
        class="sidebar app_bg_darkBlue fixed"
        :class="isOpen ? '' : 'sidebar_closed'"
    >
        <div 
            class="sidebar_content app_light_bg_opacity"
            
        >
            
            <div v-show="isOpen" class="sidebar_top_wrapper text-center">
                <p class="white--text">
                    Welcome, 
                    <br>
                    <strong>
                        {{name}}
                    </strong>
                </p>
            </div>
            
            <div class="sidebar_links_wrapper mt-10">
                <template v-for="(link, index) in links">
                    <SidebarLink 
                        :key="index" 
                        :link="link" 
                    />
                </template>
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
                    url: '/dashboard',
                    icon: 'mdi-view-dashboard'
                },
                {
                    text: 'Users',
                    url: '/users',
                    icon: 'mdi-account-supervisor-circle',
                    children: [
                        {
                            text: 'List',
                            url: '/users',
                            icon: 'mdi-account-details'
                        },
                        {
                            text: 'Create',
                            url: '/users/new',
                            icon: 'mdi-account-plus'
                        },
                        {
                            text: 'Statistics',
                            url: '/users/statistics',
                            icon: 'mdi-account-search'
                        },
                    ]
                },
                {
                    text: 'Content',
                    url: '/courses',
                    icon: 'mdi-book-open-page-variant',
                    children: [
                        {
                            text: 'Courses',
                            url: '/courses',
                        },
                        {
                            text: 'Lessons Fields',
                            url: '/courses/lessons-fields',
                        },
                        {
                            text: 'Lessons',
                            url: '/courses/lessons',
                        },
                        {
                            text: 'Videos',
                            url: '/courses/videos',
                        },
                        {
                            text: 'Statistics',
                            url: '/courses/statistics',
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

    .sidebar_content {
        height: 90vh;
        width: 90%;
        margin-left: 10%;
        margin-top: 5vh;
        border-radius: 10px 0 0 10px;
        padding: 20px;
        overflow-y: auto
    }

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