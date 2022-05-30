<template>
    <v-flex md6 class="content_reorder_card">
        <div>
            <v-tabs
                v-model="currentTab"
                color="primary"
                slider-color="primary"
            >
                <v-tab v-for="(tab, index) in tabs" :key="index">
                    {{ tab }}
                </v-tab> 
            </v-tabs>
            <br>
            <reorder-content-card :loading="loading" :key="currentTab" :content="reorderContent" @submit="submit" />
        </div>
    </v-flex>
</template>

<script>
import ReorderContentCard from '../Cards/ReorderContentCard.vue';

export default {
    components: {
        ReorderContentCard,
    },

    props: {
        course: {
            type: Object,
            required: true
        }
    },
    
    data() {
        return {
            currentTab: 0,
            tabs: ['Course Areas', 'Lessons'],
            loading: false
        }
    },

    computed: {
        lessons() {
            const lessons = this.$store.getters['LessonState/lessons'];
            if(!lessons) {
                return [];
            }
            
            return lessons.filter(lesson => lesson.course_id === this.course.id)
        },

        courseAreas() {
            const courseAreas = this.$store.getters['CourseAreaState/courseAreas'];
            if(!courseAreas) {
                return [];
            }
            
            return courseAreas.filter(courseArea => courseArea.course_id === this.course.id)
        },

        isCourseAreaMode() {
            return this.tabs[this.currentTab] === 'Course Areas';
        },

        reorderContent() {
            return this.isCourseAreaMode ? this.courseAreas : this.lessons;
        }
    },

    methods: {
        async submit(content) {
            this.loading = true;
            if(this.isCourseAreaMode) {
                await this.$store.dispatch('CourseAreaState/updateOrder', content);
            } else {
                await this.$store.dispatch('LessonState/updateOrder', content);
            }
            this.loading = false;
        }
    }
}
</script>

<style scoped>

    .content_reorder_card > div{
        width: 100%;
    }

</style>