<template>
    <v-container fluid>
        <TopCard 
            text="Marketing"
            createable
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="marketings"
            :loading="loadingMarketings"
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
                { text: 'Name',         value: 'name' },
                { text: 'Course',       value: 'name' },
                { text: 'Email',        value: 'email' },
                { text: 'Phone',        value: 'phone' },
                { text: 'Fee',          value: 'fee' },
                { text: 'Link',         value: 'link' },
                { text: 'Total Orders', value: 'totalOrders' },
                { text: 'Created At',   value: 'created_at' },
                { text: 'Status',       value: 'status' },
                { text: 'Actions',      value: 'actions',   align: 'right' },
            ],
            search: '',
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        marketings() {
            let marketings = this.$store.getters['MarketingState/marketings'];
            if(!marketings) {
                return [];
            }

            marketings = marketings.map(marketing => {
                return {
                    ...marketing,
                    totalOrders: marketing.orders.length
                };
            })
            
            // filter by status
            return marketings.filter(marketing => this.filterStatuses.includes(marketing.status))
            // return marketings;
        },

        loadingMarketings() {
            return !this.$store.getters['MarketingState/marketings'];
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('MarketingState/deleteMarketings', data)
        },

        viewItem(item) {
            this.$router.push('/content/marketings/show/' + item.id)
        },

        reload() {
            this.$store.dispatch('MarketingState/getMarketings');
        },
        
        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },
    }
}
</script>

<style scoped>
</style>