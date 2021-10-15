<template>
    <div>
        <div 
            v-if="isOpen"
            class="sidebar_link" 
            @click="goToLink()"
        >
            <div 
                class="sidebar_link_row pointer rounded h100 flex space_between align_center"
                :class="isActive ? 'sidebar_link_active app_darkBlue' : 'white--text'"
            >
                <v-flex d-flex align-center>
                    <v-icon class="mr-3" :color="isActive ? 'black' : 'white'">{{link.icon}}</v-icon>
                    <span>
                        {{link.text}}
                    </span>                    
                </v-flex>
                <span v-if="hasChildren" @click.stop="toggleChildrenStatus()">
                    <v-icon :color="isActive ? 'black' : 'white'" v-if="isChildrenOpen">mdi-menu-down-outline</v-icon>
                    <v-icon :color="isActive ? 'black' : 'white'" v-else>mdi-menu-right-outline</v-icon>
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
                </template>
            </div>
            </transition>
        </div>
        <div 
            class="sidebar_link_closed" 
            v-else :title="link.text"
            @click="goToLink()"
        >
            <v-icon>{{link.icon}}</v-icon>
        </div>
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

    created() {
        if(this.isActive) {
            this.isChildrenOpen = true;
        }
    },

    computed: {
        isActive() {
            if(this.link.url === '/') {
                return this.$route.path === '/';
            }

            if(this.link.url !== '/') {
                return this.$route.path.includes(this.link.url);
            }
        },

        hasChildren() {
            return this.link.children;
        },

        isOpen() {
            return this.$store.getters['AppState/sidebarState'];
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
            if(this.$route.path !== this.link.childrenUrl) {
                this.$router.push(this.link.childrenUrl ? this.link.childrenUrl : this.link.url);
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

    .sidebar_link_closed {
        background-color: #FFFFFFCC;
        margin-bottom: 10px;
        border-radius: 50%;
        height: 35px;
        width: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .sidebar_link_row {
        background-color: #FFFFFF11;
        padding: 25px 20px;
        height: 40px;
        transition: .3s all linear;
    }

    .sidebar_link_row:hover {
        background-color: #FFFFFF55;
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
</style>