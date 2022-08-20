<template>
    <div>
        <TopCard 
            text="Course Recommendations"
            createable
            :createLink="createLink"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="recommendations"
            :loading="isLoading"
            viewable
            deleteable
            searchable
            multiple
            mainField="name"
            @delete="deleteItem"
            @view="viewItem"
        />
    </div>
</template>

<script>
import TopCard from '../../components/Cards/TopCard.vue'
import TableCard from '../../components/Cards/TableCard.vue'

export default {
    components: {
        TopCard,
        TableCard
    },

    props: {
        course: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            headers: [
                { text: 'Person Name', value: 'name' },
                { text: 'Content',     value: 'content' },
                { text: 'Actions',     value: 'actions',       align: 'right' },
            ],
            search: '',
        }
    },

    computed: {
        recommendations() {
            return this.course.recommendations;
        },

        isLoading() {
            return !this.$store.getters['UserCourseState/users_courses'];
        },

        createLink() {
            return '/content/courses/recommendations/new?course_id=' + this.$route.params.courseID;
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('CourseState/deleteCourseRecommendations', {
                courseId: this.$route.params.courseID,
                recommendationIds: data
            })
        },

        viewItem(item) {
            this.$router.push('/content/courses/recommendations/show/' + item.id)
        },
    }
}
</script>

<style scoped>
</style>