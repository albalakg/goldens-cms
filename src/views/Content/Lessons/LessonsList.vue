<template>
    <v-container fluid>
        <TopCard 
            text="Lessons"
            createable
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="lessons"
            :loading="loadingLessons"
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
                { text: 'Category',     value: 'course_category_name' },
                { text: 'Course',       value: 'course_name' },
                { text: 'Course Area',  value: 'course_area_name' },
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
            let lessons = this.$store.getters['LessonState/lessons'];

            if(!lessons) {
                return [];
            }

            // filter by status
            return lessons.filter(lesson => this.filterStatuses.includes(lesson.status))
        },

        loadingLessons() {
            return !this.$store.getters['LessonState/lessons'];
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('LessonState/deleteLessons', data)
        },

        viewItem(item) {
            this.$router.push('/content/lessons/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('LessonState/getLessons');
        }
    }
}
</script>

<style scoped>
</style>