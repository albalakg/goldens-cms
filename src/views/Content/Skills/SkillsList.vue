<template>
    <v-container fluid>
        <TopCard 
            text="Skills"
            createable
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="skills"
            :loading="loadingSkills"
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
import TopCard from './../../../components/Cards/TopCard.vue'
import TableCard from './../../../components/Cards/TableCard.vue'
import { STATUSES_SELECTION, STATUSES_VALUES } from './../../../helpers/Status'

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
        skills() {
            let skills = this.$store.getters['SkillState/skills'];

            if(!skills) {
                return [];
            }

            // filter by status
            return skills.filter(skill => this.filterStatuses.includes(skill.status))
        },

        loadingSkills() {
            return !this.$store.getters['SkillState/skills'];
        }
    },

    methods: {
       
        deleteItems(data) {
            this.$store.dispatch('SkillState/deleteSkills', data)
        },

        viewItem(item) {
            this.$router.push('/content/skills/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('SkillState/getSkills');
        }
    }
}
</script>

<style scoped>
</style>