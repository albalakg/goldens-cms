<template>
    <v-container fluid>
        <TopCard 
            text="Courses"
            createable
        />

        <br>

        <TableCard
            :headers="headers"
            :items="courses"
            :loading="loadingCourses"
            :filerStatus="statuses"
            viewable
            deleteable
            searchable
            multipleEdit
            mainField="full_name"
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
                { text: 'Name', value: 'full_name' },
                { text: 'Category', value: 'category_name' },
                { text: 'Lessons', value: 'lessons' },
                { text: 'Status', value: 'status' },
                { text: 'Price', value: 'price' },
                { text: 'Image', value: 'image' },
                { text: 'Created At', value: 'created_at' },
                { text: 'Actions', value: 'actions', align: 'right' },
            ],
            search: '',
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        courses() {
            let courses = this.$store.getters['CourseState/courses'];

            if(!courses) {
                return [];
            }

            // filter by status
            courses = courses.data.filter(course => this.filterStatuses.includes(course.status))

            return courses;
        },

        loadingCourses() {
            return !this.$store.getters['CourseState/courses'];
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('CourseState/deleteCourses', data)
        },

        viewItem(item) {
            this.$router.push('/courses/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        }
    }
}
</script>

<style scoped>
</style>