<template>
    <v-container fluid>
        <TopCard 
            text="Training Options"
            createable
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="trainingOptions"
            :loading="loadingTrainingOptions"
            viewable
            deleteable
            searchable
            multiple
            mainField="name"
            @delete="deleteItems"
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
                { text: 'Created At',   value: 'created_at' },
                { text: 'Actions',      value: 'actions',   align: 'right' },
            ],
            search: '',
        }
    },

    computed: {
        trainingOptions() {
            return this.$store.getters['TrainingOptionState/trainingOptions'] ?? [];
        },

        loadingTrainingOptions() {
            return !this.$store.getters['TrainingOptionState/trainingOptions'];
        }
    },

    methods: {
       
        deleteItems(data) {
            this.$store.dispatch('TrainingOptionState/deleteTrainingOptions', data)
        },

        viewItem(item) {
            this.$router.push('/content/training-options/show/' + item.id)
        },

        reload() {
            this.$store.dispatch('TrainingOptionState/getTrainingOptions');
        }
    }
}
</script>

<style scoped>
</style>