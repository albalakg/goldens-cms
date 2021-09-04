<template>
    <div 
        class="sidebar_link_row sidebar_child_link rounded pointer" 
        :class="isActive ? 'sidebar_link_active app_darkBlue' : 'white--text'"
        @click.stop="goToLink()"
    >
        <div class="h100 flex space_between align_center">
            <span>
                {{link.text}}
            </span>  
            <v-icon v-if="link.icon" class="mr-3" :color="isActive ? 'black' : 'white'">{{link.icon}}</v-icon>
        </div>
    </div>
</template>

<script>
export default {
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
            return this.link.url === this.$route.path;
        }
    },

    methods: {
        goToLink() {
            if(this.link.children) {
                this.toggleChildrenStatus();
            }
            
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
    } 

    .sidebar_link_row {
        width: 90%;
        margin-left: 10%;
        background-color: #FFFFFF77;
        padding: 5px 5px 5px 10px;
        height: 40px;
        transition: .3s all linear;
        margin-top: 5px;
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
</style>