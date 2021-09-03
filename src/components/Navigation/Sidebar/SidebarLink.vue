<template>
    <div 
        class="sidebar_link" 
        @click="goToLink()"
    >
        <div 
            class="sidebar_link_row pointer rounded h100 flex space_between align_center"
            :class="isActive ? 'sidebar_link_active' : ''"
        >
            <span>
                {{link.text}}
            </span>
            <span v-if="hasChildren">
                <v-icon v-if="isChildrenOpen">mdi-menu-down-outline</v-icon>
                <v-icon v-else>mdi-menu-right-outline</v-icon>
            </span>
        </div>
        <transition name="fade" mode="out-in">
        <div 
            v-if="isChildrenOpen"
            class="sidebar_childrens"
        >
            <template v-for="(subLink, subLinkIndex) in link.children">
                <SubLink 
                    :link="subLink"
                    :key="subLinkIndex"
                />
                <!-- <div 
                    class="sidebar_link_row sidebar_child_link rounded pointer" 
                    :class="isSubLinkActive ? 'sidebar_link_active' : ''"
                    :key="subLinkIndex" 
                    @click.stop="goToLink(link.url + subLink.url, false)"
                >
                    <div class="h100 flex space_between align_center">
                        <span>
                            {{subLink.text}}
                        </span>
                    </div>
                </div> -->
            </template>
        </div>
        </transition>
    </div>
</template>

<script>
import SubLink from './SidebarSubLink.vue';
export default {
    components: {
        SubLink
    },

    props: {
        link: {
            type: Object,
            required: true
        },
    },

    data() {
        return {
            isChildrenOpen: false
        }
    },

    computed: {
        isActive() {
            return this.$route.path.includes(this.link.url);
        },

        hasChildren() {
            return this.link.children;
        }
    },

    watch: {
        '$route': function() {
            this.isChildrenOpen = false;

            if(this.isActive) {
                this.isChildrenOpen = true;
            }
        }
    },

    methods: {
        goToLink() {
            if(this.$route.path !== this.link.url) {
                this.$router.push(this.link.url);
            }
        },

        toggleChildrenStatus() {
            this.isChildrenOpen = !this.isChildrenOpen
        }
    }
}
</script>

<style scoped>

    .sidebar_link {
        height: 100%;
        font-weight: 500;
        margin-bottom: 10px;
    } 

    .sidebar_link_row {
        background-color: #FFFFFF77;
        padding: 5px 5px 5px 10px;
        height: 40px;
        transition: .3s all linear;
    }

    .sidebar_link_row:hover {
        background-color: #FFFFFFAA;
        transform: translateX(10px);
    }

    .sidebar_link_active {
        font-weight: bold;
        transform: translateX(10px);
        background-color: #FFFFFFCC !important;
    }

    .sidebar_childrens {
        margin-top: 10px;
        margin-left: 10px;
        transition: .0s all linear;
    }
/* 
    .sidebar_child_link {
        margin-top: 5px;
        width: 95%;
        margin-left: 5%;
        height: 35px;
        font-size: 14px;
    } */
</style>