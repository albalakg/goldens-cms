<template>
    <div 
        class="sidebar app_bg_darkBlue fixed"
        :class="isOpen ? '' : 'sidebar_closed'"
    >
        <div 
            class="sidebar_content app_light_bg_opacity"
            
        >
            
            <div class="sidebar_top_wrapper">
            </div>
            
            <div class="sidebar_links_wrapper">
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
                    icon: 'mdi-view-dashboard-outline'
                },
                {
                    text: 'Users',
                    url: '/users',
                    icon: 'mdi-account-circle-outline',
                    children: [
                        {
                            text: 'List',
                            url: '/users',
                        },
                        {
                            text: 'Create',
                            url: '/users/new',
                        },
                        {
                            text: 'Statistics',
                            url: '/users/statistics',
                        },
                    ]
                },
                {
                    text: 'Content',
                    url: '/courses',
                    icon: 'mdi-book-open-page-variant-outline',
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
        height: 95vh;
        width: 90%;
        margin-left: 10%;
        margin-top: 2.5vh;
        border-radius: 10px 0 0 10px;
        padding: 20px;
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
        min-width: 50px !important;
        width: 5vw;

        .sidebar_content {
            min-width: 50px !important;
            margin-left: 30%;
        }
    }

</style>