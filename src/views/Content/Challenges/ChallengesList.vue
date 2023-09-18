<template>
    <v-container fluid>
        <TopCard 
            text="Challenges"
            createable
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="challenges"
            :loading="loadingChallenges"
            :filterStatus="statuses"
            viewable
            deleteable
            searchable
            multiple
            mainField="name"
            @delete="deleteItem"
            @view="viewItem"
            @filterByStatus="filterByStatus"
        />
    </v-container>
</template>

<script>
import TopCard from '../../../components/Cards/TopCard.vue'
import TableCard from '../../../components/Cards/TableCard.vue'
import { STATUSES_SELECTION, STATUSES_VALUES } from '../../../helpers/Status'

export default {
    components: {
        TopCard,
        TableCard
    },

    data() {
        return {
            headers: [
                { text: 'Name',             value: 'name' },
                { text: 'Expired At',       value: 'expired_at' },
                { text: 'Status',           value: 'status' },
                { text: 'User Attempts',    value: 'user_attempts' },
                { text: 'Actions',          value: 'actions',   align: 'right' },
            ],
            search: '',
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        challenges() {
            let challenges = this.$store.getters['ChallengeState/challenges'];

            if(!challenges) {
                return [];
            }

            // filter by status
            return challenges.filter(challenge => this.filterStatuses.includes(challenge.status))
        },

        loadingChallenges() {
            return !this.$store.getters['ChallengeState/challenges'];
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('ChallengeState/deleteChallenges', data)
        },

        viewItem(item) {
            this.$router.push('/content/challenges/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('ChallengeState/getChallenges');
        }
    }
}
</script>

<style scoped>
</style>