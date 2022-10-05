<template>
    <v-container fluid>
        <TopCard 
            text="Terms"
            createable
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="terms"
            :loading="loadingTerms"
            :filterStatus="statuses"
            viewable
            deleteable
            searchable
            multiple
            mainField="name"
            @delete="deleteItems"
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
                { text: 'Name',         value: 'name' },
                { text: 'Description',  value: 'description' },
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
        terms() {
            let terms = this.$store.getters['TermState/terms'];

            if(!terms) {
                return [];
            }

            // filter by status
            return terms.filter(term => this.filterStatuses.includes(term.status))
        },

        loadingTerms() {
            return !this.$store.getters['TermState/terms'];
        }
    },

    methods: {
       
        deleteItems(data) {
            this.$store.dispatch('TermState/deleteTerms', data)
        },

        viewItem(item) {
            this.$router.push('/content/terms/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('TermState/getTerms');
        }
    }
}
</script>

<style scoped>
</style>