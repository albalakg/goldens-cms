<template>
    <v-container fluid>
        <TopCard 
            text="Equipment"
            createable
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="equipment"
            :loading="loadingEquipment"
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
                { text: 'Image',        value: 'imageSrc' },
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
        equipment() {
            let equipment = this.$store.getters['EquipmentState/equipment'];

            if(!equipment) {
                return [];
            }

            // filter by status
            return equipment.filter(equipment => this.filterStatuses.includes(equipment.status))
        },

        loadingEquipment() {
            return !this.$store.getters['EquipmentState/equipment'];
        }
    },

    methods: {
       
        deleteItems(data) {
            this.$store.dispatch('EquipmentState/deleteEquipment', data)
        },

        viewItem(item) {
            this.$router.push('/content/equipment/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('EquipmentState/getEquipment');
        }
    }
}
</script>

<style scoped>
</style>