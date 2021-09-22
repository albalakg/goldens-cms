<template>
    <v-container fluid>
        <TopCard 
            text="Course Categories"
            createable
        />

        <br>

        <TableCard
            :headers="headers"
            :items="courseCategories"
            :loading="loadingCourseCategories"
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
                { text: 'Courses',      value: 'courses_count' },
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
        courseCategories() {
            let courseCategories = this.$store.getters['CourseCategoryState/courseCategories'];

            if(!courseCategories) {
                return [];
            }

            // filter by status
            courseCategories = courseCategories.data.filter(lesson => this.filterStatuses.includes(lesson.status))
            console.log('courseCategories', courseCategories);
            return courseCategories;
        },

        loadingCourseCategories() {
            return !this.$store.getters['CourseCategoryState/courseCategories'];
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('CourseCategoryState/deleteCourseCategories', data)
        },

        viewItem(item) {
            this.$router.push('/content/course-categories/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        }
    }
}
</script>

<style scoped>
</style>