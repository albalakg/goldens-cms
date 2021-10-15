<template>
    <v-container fluid>
        <TopCard 
            text="Support Categories"
            createable
            reloadable
            @reload="reload"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="support_categories"
            :loading="loadingSupport_tickets"
            :filterStatus="statuses"
            deleteable
            searchable
            multiple
            mainField="name"
            @delete="deleteItems"
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
                { text: 'Name',         value: 'name' },
                { text: 'Created At',   value: 'created_at' },
                { text: 'Status',       value: 'status',    align: 'right' },
                { text: 'Actions',      value: 'actions',   align: 'right' },
            ],
            search: '',
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        support_categories() {
            let support_categories = this.$store.getters['SupportState/support_categories'];

            if(!support_categories) {
                return [];
            }

            // filter by status
            support_categories = support_categories.filter(support => this.filterStatuses.includes(support.status))

            return support_categories;
        },

        loadingSupport_tickets() {
            return !this.$store.getters['SupportState/support_categories'];
        }
    },

    methods: {
        deleteItems(data) {
            this.$store.dispatch('SupportState/deleteSupportCategories', data)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('SupportState/getSupportCategories');
        }
    }
}
</script>

<style scoped>
</style>