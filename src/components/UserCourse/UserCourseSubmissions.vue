<template>
    <v-card class="pa-5">
        <TableCard
            :headers="headers"
            :items="items"
            :loading="isLoading"
            :filterStatus="statuses"
            searchable
            viewable
            mainField="full_name"
            @view="viewItem"
            @filterByStatus="filterByStatus"
        />
    </v-card>
</template>

<script>
import TableCard from './../Cards/TableCard.vue'
import { STATUSES_SELECTION, STATUSES_VALUES } from './../../helpers/Status'

export default {
    components: {
        TableCard,
    },

    data() {
        return {
            headers: [
                { text: 'Course',       value: 'course_name' },
                { text: 'Video',        value: 'video' },
                { text: 'Comment',      value: 'comment' },
                { text: 'Created At',   value: 'created_at' },
                { text: 'Status',       value: 'status',    align: 'right' },
                { text: 'Actions',      value: 'actions',   align: 'right' },
            ],
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES,
        }
    },
    
    props: {
        userCourse: {
            type: Object,
            required: true
        },

        user: {
            type: Object,
            required: true
        },

        course: {
            type: Object,
            required: true
        },
    },

    computed: {
        isLoading() {
            return !this.$store.getters['TestState/tests']
        },

        items() {
            const tests     = this.$store.getters['TestState/tests'];
            const courses   = this.$store.getters['CourseState/courses'];

            let data = tests ? tests : [];
            if(!data.length) {
                return data;
            }

            // filter by status
            data = data.filter(item => this.filterStatuses.includes(item.status))

            data.forEach(item => {
                const course = courses.find(course => course.id === item.user_course.course_id);
                if(course) {
                    item.course_name    = course.name;
                    item.course_id      = course.id;
                }
            });

            return data;
        },

        totalLessons() {
            return this.lessons.filter(lesson => lesson.course_id === this.course.id).length;
        }
    },

    created() {
        this.$store.dispatch('UserCourseState/getUserCourseProgress', this.userCourse.id)
    },

    methods: {
        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        viewItem(item) {
            this.$router.push('/content/tests/show/' + item.id)
        },
    }
}
</script>

<style scoped>
</style>