<template>
    <div>
        <TopCard 
            text="User's Support Tickets"
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
    </div>
</template>

<script>
import TopCard from '../../components/Cards/TopCard.vue'
import TableCard from '../../components/Cards/TableCard.vue'
import { STATUSES_SELECTION, STATUSES_VALUES } from '../../helpers/Status'

export default {
    components: {
        TopCard,
        TableCard
    },

    data() {
        return {
            headers: [
                { text: 'Support Number',   value: 'support_number' },
                { text: 'Category',         value: 'support_category' },
                { text: 'Title',            value: 'title' },
                { text: 'Status',           value: 'status' },
                { text: 'Created At',       value: 'created_at' },
                { text: 'Actions',          value: 'actions',       align: 'right' },
            ],
            search: '',
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        support_tickets() {
            const support_tickets       = this.$store.getters['SupportState/support_tickets'];
            const support_categories    = this.$store.getters['SupportState/support_categories'];
            if(!support_tickets || !support_categories) {
                return [];
            }

            // filter by status
            let data = support_tickets.filter(item => this.filterStatuses.includes(item.status));

            // filter by user
            data = data.filter(item => item.user_id === Number(this.$route.params.userID));

            // add user name
            data.forEach((item) => {
                const support_category = support_categories.find(support => support.support_category_id === item.support_id);
                item.support_category = support_category ? support_category.name : 'Unknown';
            });
            
            return data;
        },

        isLoading() {
            return !this.$store.getters['SupportState/support_tickets'];
        }
    },

    methods: {
       
        viewItem(item) {
            this.$router.push('/users/users-supports/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        }
    }
}
</script>

<style scoped>
</style>