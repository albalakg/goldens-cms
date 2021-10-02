<template>
    <div>
        <v-card class="pa-3">
            <v-flex d-flex>
                <div>
                    <v-card-title primary-title>
                        First Expirartion Date
                    </v-card-title>
                    <small class="ml-4"> {{startDate}} </small>
                </div>
                <div>
                    <v-card-title primary-title>
                        Current Expiration Date
                    </v-card-title>
                    <small class="ml-4"> {{userCourse.end_at}} </small>
                </div>
            </v-flex>
        </v-card>
        
        <br>

        <v-card class="pa-5">
            <TableCard
                :headers="headers"
                :items="items"
                :loading="isLoading"
                :filerStatus="statuses"
                searchable
                :statusTexts="statusTexts"
                mainField="full_name"
                @filterByStatus="filterByStatus"
            />
        </v-card>
    </div>
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
                { text: 'Days',         value: 'days' },
                { text: 'Created At',   value: 'created_at' },
                { text: 'Created By',   value: 'created_by' },
            ],
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES,
            statusTexts: [
                'None',
                'Done',
                'In Progress',
            ]
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
            let data = this.userCourse.progress ? this.userCourse.progress.data : [];
            if(!data.length) {
                return data;
            }

            // filter by status
            data = data.filter(item => this.filterStatuses.includes(item.status))

            data.forEach(item => {
                const lesson = this.lessons.data.find(lesson => lesson.id === item.course_lesson_id);
                item.course_lesson_name = lesson.name; 
                item.course_lesson_id   = lesson.id; 
                item.course_area_name   = lesson.course_area_name; 
                item.course_area_id     = lesson.course_area_id; 
            });

            return data;
        },

        startDate() {
            let days = 0;

            if(this.userCourse.extenstions) {
                days = this.userCourse.extenstions.reduce((prevItem, nextItem) => {
                    console.log('prevItem', prevItem);
                    console.log('nextItem', nextItem);
                })
            }
            
            const dateOffset = (24*60*60*1000) * days;

            const date = new Date(this.userCourse.end_at);
            return new Date(date.setDate(date.getDate() - dateOffset));
        }
    },

    created() {
        this.$store.dispatch('UserCourseState/getUserCourseExtenstions', this.userCourse.id)
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