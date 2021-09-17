<template>
    <v-container fluid>
        <TopCard 
            text="Course Areas"
            createable
        />

        <br>

        <TableCard
            :headers="headers"
            :items="lessons"
            :loading="loadingCourseAreas"
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
                { text: 'CourseArea',        value: 'lesson' },
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
        lessons() {
            let lessons = this.$store.getters['CourseAreaState/lessons'];

            if(!lessons) {
                return [];
            }

            // filter by status
            lessons = lessons.data.filter(lesson => this.filterStatuses.includes(lesson.status))

            return lessons;
        },

        loadingCourseAreas() {
            return !this.$store.getters['CourseAreaState/lessons'];
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('CourseAreaState/deleteCourseAreas', data)
        },

        viewItem(item) {
            this.$router.push('/lessons/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        }
    }
}
</script>

<style scoped>
</style>