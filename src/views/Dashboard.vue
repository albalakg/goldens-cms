<template>
<v-container fluid>
    <v-flex v-if="!isLoading">
        <v-flex md4 xl3 class="mx-2">
            <DashboardCard 
                
            />
        </v-flex>
        <v-flex md4 xl3 class="mx-2">
            <DashboardCard 
                
            />
        </v-flex>
        <v-flex md4 xl3 class="mx-2">
            <DashboardCard 
                
            />
        </v-flex>
        <v-flex md4 xl3 class="mx-2">
            <DashboardCard 
                
            />
        </v-flex>
    </v-flex>
    <div v-else>
        <v-skeleton-loader
            class="mx-auto w100"
            type="card"
        >
    </v-skeleton-loader>
    </div>
</v-container>
</template>

<script>
import DashboardCard from './../components/Cards/DashboardCard.vue'

export default {
    components: {
        DashboardCard,
    },

    data() {
        return {
            attrs: {
                class: 'mb-6',
                boilerplate: true,
                elevation: 2,
            },
        }
    },

    computed: {
        totalUsers() {
            return this.$store.getters['UserState/totalUsers'];
        },

        isLoading() {
            return this.$store.getters['AppState/isLoading'];
        }
    },
}
</script>

<style scoped>
</style>