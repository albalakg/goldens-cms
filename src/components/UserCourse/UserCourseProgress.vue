<template>
    <div>
        <v-card class="pa-5">
            <v-card-title primary-title>
                Finished Lessons {{userCourse.finished_lessons_count}} / {{totalLessons}}
            </v-card-title>
        </v-card>
        
        <br>

        <v-card class="pa-5">
            <TableCard
                :headers="headers"
                :items="items"
                :loading="isLoading"
                :filterStatus="statusTexts"
                searchable
                mainField="full_name"
                @filterByStatus="filterByStatus"
            />
        </v-card>
    </div>
</template>

<script>
import TableCard from './../Cards/TableCard.vue'
import { STATUSES_VALUES, PROGRESS_STATUSES } from './../../helpers/Status'

export default {
    components: {
        TableCard,
    },

    data() {
        return {
            headers: [
                { text: 'Lesson',       value: 'course_lesson_name' },
                { text: 'Course Area',  value: 'course_area_name' },
                { text: 'Started At',   value: 'created_at' },
                { text: 'Finished At',  value: 'finished_at' },
                { text: 'Status',       value: 'status',    align: 'right' },
            ],
            filterStatuses: STATUSES_VALUES,
            statusTexts: PROGRESS_STATUSES
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
            return !this.userCourse.progress;
        },

        lessons() {
            return this.$store.getters['LessonState/lessons'];
        },

        items() {
            let data = this.userCourse.progress ? this.userCourse.progress : [];
            if(!data.length) {
                return data;
            }

            // filter by status
            data = data.filter(item => this.filterStatuses.includes(item.status))

            data.forEach(item => {
                const lesson = this.lessons.find(lesson => lesson.id === item.course_lesson_id);
                item.course_lesson_name = lesson.name; 
                item.course_lesson_id   = lesson.id; 
                item.course_area_name   = lesson.course_area_name; 
                item.course_area_id     = lesson.course_area_id; 
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
        }
    }
}
</script>

<style scoped>
</style>