<template>
    <v-container fluid>
        <TopCard 
            text="Terms and Conditions"
            createable
        />

        <br>

        <TableCard
            :headers="headers"
            :items="termsAndConditions"
            :loading="isLoading"
            searchable
            viewable
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
                { text: 'Identifier',   value: 'id' },
                { text: 'Created At',   value: 'created_at' },
                { text: 'Created By',   value: 'full_name' },
                { text: 'Actions',      value: 'actions',   align: 'right' },
            ],
            search: '',
        }
    },

    computed: {
        termsAndConditions() {
            let termsAndConditions    = this.$store.getters['PoliciesState/termsAndConditions'];
            const users                 = this.$store.getters['UserState/users'];

            if(!users || !termsAndConditions) {
                return [];
            }

            termsAndConditions.forEach(tnc => {
                const user = users.find(user => user.id === tnc.created_by);
                if(user) {
                    tnc.full_name  = user.full_name;
                    tnc.user_id    = user.id;
                }
            });

            return termsAndConditions;
        },

        isLoading() {
            return !this.$store.getters['PoliciesState/termsAndConditions'];
        }
    },

    methods: {
        viewItem(item) {
            this.$router.push('/policies/terms-and-conditions/show/' + item.id)
        },
    }
}
</script>

<style scoped>
</style>