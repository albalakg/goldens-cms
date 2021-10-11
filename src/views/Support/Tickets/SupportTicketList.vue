<template>
    <v-container fluid>
        <TopCard 
            text="Support Tickets"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="support_tickets"
            :loading="isLoading"
            :filterStatus="statuses"
            viewable
            searchable
            mainField="name"
            @view="viewItem"
            @filterByStatus="filterByStatus"
        />
    </v-container>
</template>

<script>
import TopCard from '../../../components/Cards/TopCard.vue'
import TableCard from '../../../components/Cards/TableCard.vue'
import { PROGRESS_SELECTION, STATUSES_VALUES } from '../../../helpers/Status'

export default {
    components: {
        TopCard,
        TableCard
    },

    data() {
        return {
            headers: [
                { text: 'Support ID',   value: 'support_number' },
                { text: 'Category',     value: 'support_category' },
                { text: 'User',         value: 'full_name' },
                { text: 'Title',        value: 'title' },
                { text: 'Created At',   value: 'created_at' },
                { text: 'Status',       value: 'status',    align: 'right' },
                { text: 'Actions',      value: 'actions',   align: 'right' },
            ],
            search: '',
            statuses: PROGRESS_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        support_tickets() {
            let support_tickets             = this.$store.getters['SupportState/support_tickets'];
            const users                     = this.$store.getters['UserState/users'];
            const support_categories        = this.$store.getters['SupportState/support_categories'];

            if(!support_tickets || !support_categories || !users) {
                return [];
            }

            // filter by status
            support_tickets = support_tickets.filter(support => this.filterStatuses.includes(support.status))

            support_tickets.forEach(item => {
                const user = users.find(user => user.id === item.user_id);
                if(user) {
                    item.full_name  = user.full_name;
                    item.user_id    = user.id;
                }
                
                const support_category = support_categories.find(support_category => support_category.id === item.support_category_id);
                if(support_category) {
                    item.support_category       = support_category.name;
                    item.support_category_id    = support_category.id;
                } else {
                    item.support_category  = 'Unknown';
                }
            })

            return support_tickets;
        },

        isLoading() {
            return !this.$store.getters['SupportState/support_tickets'];
        }
    },

    methods: {
        viewItem(item) {
            this.$router.push('/support/tickets/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        }
    }
}
</script>

<style scoped>
</style>