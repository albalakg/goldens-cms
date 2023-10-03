<template>
    <div>
        <TopCard 
            text="Challenge Attempts"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="attempts"
            :loading="isLoading"
            viewable
            searchable
            multiple
            mainField="name"
            :filterStatus="statuses"
            @view="viewItem"
            @filterByStatus="filterByStatus"
        />
    </div>
</template>

<script>
import TopCard from '../../components/Cards/TopCard.vue'
import TableCard from '../../components/Cards/TableCard.vue'
import { CHALLENGE_STATUSES, CHALLENGE_VALUES } from '../../helpers/Status'

export default {
    components: {
        TopCard,
        TableCard
    },

    props: {
        challenge: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            headers: [
                { text: 'Person Name',  value: 'full_name' },
                { text: 'Status',       value: 'status' },
                { text: 'Created At',   value: 'created_at' },
                { text: 'Actions',      value: 'actions',       align: 'right' },
            ],
            search: '',
            key: 1,
            statuses: CHALLENGE_STATUSES,
            filterStatuses: CHALLENGE_VALUES
        }
    },

    async created() {
        await this.$store.dispatch('ChallengeState/getChallengeAttemptsById', this.challenge.id);
        this.key++;
    },

    computed: {
        attempts() {
            this.key;
            return this.challenge.attempts ? this.challenge.attempts.filter(attempt => this.filterStatuses.includes(attempt.status)) : [];
        },
        
        isLoading() {
            this.key;
            return !this.challenge.attempts;
        },
    },

    methods: {
        viewItem(item) {
            this.$router.push('/users/users-challenges/' + item.id)
        },
        
        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },
    }
}
</script>

<style scoped>
</style>