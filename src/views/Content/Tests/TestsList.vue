<template>
    <v-container fluid>
        <TopCard 
            text="Tests"
            createable
        />

        <br>

        <TableCard
            :headers="headers"
            :items="tests"
            :loading="loadingTests"
            :filerStatus="statuses"
            viewable
            deleteable
            searchable
            multipleEdit
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
                { text: 'Name',         value: 'name' },
                { text: 'Description',  value: 'description' },
                { text: 'Test',        value: 'test' },
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
        tests() {
            let tests = this.$store.getters['TestState/tests'];

            if(!tests) {
                return [];
            }

            // filter by status
            return tests.data.filter(test => this.filterStatuses.includes(test.status))
        },

        loadingTests() {
            return !this.$store.getters['TestState/tests'];
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('TestState/deleteTests', data)
        },

        viewItem(item) {
            this.$router.push('/content/tests/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        }
    }
}
</script>

<style scoped>
</style>