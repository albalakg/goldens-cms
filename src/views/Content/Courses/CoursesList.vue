<template>
    <v-container fluid>
        <TopCard 
            text="Courses"
            createable
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="courses"
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
                { text: 'Category',     value: 'category_name' },
                { text: 'Areas',        value: 'areas_count' },
                { text: 'Lessons',      value: 'lessons_count' },
                { text: 'Price',        value: 'price' },
                { text: 'Discount',     value: 'discount' },
                { text: 'Created At',   value: 'created_at' },
                { text: 'Status',       value: 'status',        align: 'right' },
                { text: 'Actions',      value: 'actions',       align: 'right' },
            ],
            search: '',
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        courses() {
            let courses     = this.$store.getters['CourseState/courses'];
            let courseAreas = this.$store.getters['CourseAreaState/courseAreas'];
            let lessons     = this.$store.getters['LessonState/lessons'];
            
            if(!courses || !courseAreas || !lessons) {
                return [];
            }

            courses.forEach(course => {
                course.deleteDisabledMessage    = course.areas_count ? 'Cannot delete Course that is being used' : '';
                course.areas_count              = courseAreas.filter(courseArea => courseArea.course_id == course.id).length;
                course.lessons_count            = lessons.filter(lesson => lesson.course_id == course.id).length;
            });
                        
            // filter by status
            return courses.filter(course => this.filterStatuses.includes(course.status))
        },

        isLoading() {
            return !this.$store.getters['CourseState/courses'];
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('CourseState/deleteCourses', data)
        },

        viewItem(item) {
            this.$router.push('/content/courses/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('CourseState/getCourses');
        }
    }
}
</script>

<style scoped>
</style>