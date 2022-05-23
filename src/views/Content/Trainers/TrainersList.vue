<template>
    <v-container fluid>
        <TopCard 
            text="Trainers"
            createable
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="trainers"
            :loading="loadingTrainers"
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
        trainers() {
            const trainers = this.$store.getters['TrainerState/trainers'];
            
            if(!trainers) {
                return [];
            }

            // filter by status
            return trainers.filter(trainer => this.filterStatuses.includes(trainer.status))
        },

        loadingTrainers() {
            return !this.$store.getters['TrainerState/trainers'];
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('TrainerState/deleteTrainers', data)
        },

        viewItem(item) {
            this.$router.push('/content/trainers/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('TrainerState/getTrainers');
        }
    }
}
</script>

<style scoped>
</style>