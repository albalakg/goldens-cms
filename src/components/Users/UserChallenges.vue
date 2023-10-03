<template>
    <div>
        <TopCard 
            text="User's Challenges"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="challenges"
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
        user: {
            type: Object,
            required: true
        },
        
    },

    data() {
        return {
            headers: [
                { text: 'Challenge Name',   value: 'challenge_name' },
                { text: 'Status',           value: 'status' },
                { text: 'Created At',       value: 'created_at' },
                { text: 'Actions',          value: 'actions',       align: 'right' },
            ],
            search: '',
            key: 1,
            statuses: CHALLENGE_STATUSES,
            filterStatuses: CHALLENGE_VALUES
        }
    },

    async created() {
        await this.$store.dispatch('UserState/getUserChallenges', this.$route.params.userID);
        this.key++;
    },

    computed: {
        challenges() {
            this.key;
            const currentUser = this.$store.getters['UserState/users'].find(user => user.id == this.$route.params.userID);
            if(!currentUser || !currentUser.challenges) {
                return [];
            }

            const challenges        = this.$store.getters['ChallengeState/challenges'];
            currentUser.challenges  = currentUser.challenges.map(userChallenge => {
                return  {
                    ...userChallenge,
                    challenge_name: challenges.find(challenge => challenge.id === userChallenge.challenge_id)?.name
                    };
            })

            return currentUser.challenges ? currentUser.challenges.filter(challenge => this.filterStatuses.includes(challenge.status)) : [];
        },
        
        isLoading() {
            this.key;
            const currentUser       = this.$store.getters['UserState/users'].filter(user => user.id == this.$route.params.userID);
            if(!currentUser.length) {
                return [];
            }

            return !currentUser[0].challenges;
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