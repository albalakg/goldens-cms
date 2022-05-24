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
            viewable
            deleteable
            searchable
            multiple
            mainField="name"
            @delete="deleteItem"
            @view="viewItem"
        />
    </v-container>
</template>

<script>
import TopCard from '../../../components/Cards/TopCard.vue'
import TableCard from '../../../components/Cards/TableCard.vue'

export default {
    components: {
        TopCard,
        TableCard
    },

    data() {
        return {
            headers: [
                { text: 'Name',         value: 'name' },
                { text: 'Email',        value: 'email' },
                { text: 'Phone',        value: 'phone' },
                { text: 'Discount',     value: 'discount_in_coins' },
                { text: 'Created At',   value: 'created_at' },
                { text: 'Actions',      value: 'actions',   align: 'right' },
            ],
            search: '',
        }
    },

    computed: {
        marketings() {
            const marketings = this.$store.getters['MarketingState/marketings'];
            return marketings ?? [];
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
            this.$router.push('/content/marketing/show/' + item.id)
        },

        reload() {
            this.$store.dispatch('MarketingState/getMarketings');
        }
    }
}
</script>

<style scoped>
</style>