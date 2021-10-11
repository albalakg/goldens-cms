<template>
    <v-container fluid>
        <TopCard 
            text="Cookies"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="cookies"
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
        cookies() {
            const cookies = this.$store.getters['PoliciesState/cookies'];
            return cookies ? cookies : [];
        },

        isLoading() {
            return !this.$store.getters['PoliciesState/cookies'];
        }
    },

    methods: {
      
    }
}
</script>

<style scoped>
</style>