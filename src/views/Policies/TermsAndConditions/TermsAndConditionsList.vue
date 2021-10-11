<template>
    <v-container fluid>
        <TopCard 
            text="Terms and Conditions"
            createable
        />

        <br>

        <TableCard
            :headers="headers"
            :items="terms_and_conditions"
            :loading="isLoading"
            searchable
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
                { text: 'ID',           value: 'id' },
                { text: 'Created At',   value: 'created_at' },
            ],
            search: '',
        }
    },

    computed: {
        terms_and_conditions() {
            const terms_and_conditions = this.$store.getters['PoliciesState/terms_and_conditions'];
            return terms_and_conditions ? terms_and_conditions : [];
        },

        isLoading() {
            return !this.$store.getters['PoliciesState/terms_and_conditions'];
        }
    },
}
</script>

<style scoped>
</style>