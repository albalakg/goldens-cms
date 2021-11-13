<template>
    <v-container fluid>
        <TopCard 
            text="Course Areas"
            createable
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="courseAreas"
            :loading="isLoading"
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
                { text: 'Lessons',      value: 'lessons_count' },
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
        courseAreas() {
            let courseAreas = this.$store.getters['CourseAreaState/courseAreas'];
            let lessons     = this.$store.getters['LessonState/lessons'];

            if(!courseAreas || !lessons) {
                return [];
            }

            courseAreas.forEach(course_area => {
                course_area.deleteDisabledMessage   = course_area.lessons_count ? 'Cannot delete Course Area that is being used' : '';
                course_area.lessons_count           = lessons.filter(lesson => lesson.course_area_id == course_area.id).length;
            });

            // filter by status
            return courseAreas.filter(lesson => this.filterStatuses.includes(lesson.status))
        },

        isLoading() {
            return !this.$store.getters['CourseAreaState/courseAreas'];
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('CourseAreaState/deleteCourseAreas', data)
        },

        viewItem(item) {
            this.$router.push('/content/course-areas/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('CourseAreaState/getCourseAreas');
        }
    }
}
</script>

<style scoped>
</style>