<template>
    <div>
        <TopCard 
            text="User's Courses"
            createable
            :createLink="createLink"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="users_courses"
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
    </div>
</template>

<script>
import TopCard from '../../components/Cards/TopCard.vue'
import TableCard from '../../components/Cards/TableCard.vue'
import { STATUSES_SELECTION, STATUSES_VALUES } from '../../helpers/Status'

export default {
    components: {
        TopCard,
        TableCard
    },

    data() {
        return {
            headers: [
                { text: 'Course',            value: 'course_name' },
                { text: 'Finished Lessons',  value: 'finished_lessons_count' },
                { text: 'Status',            value: 'status' },
                { text: 'Cost',              value: 'price' },
                { text: 'Discount',          value: 'discount' },
                // { text: 'Days Extended',     value: 'days_axtended' },
                { text: 'Started At',        value: 'created_at' },
                { text: 'Expired At',        value: 'end_at' },
                { text: 'Status',            value: 'status',        align: 'right' },
                { text: 'Actions',           value: 'actions',       align: 'right' },
            ],
            search: '',
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        users_courses() {
            const users_courses = this.$store.getters['UserCourseState/users_courses'];
            const courses       = this.$store.getters['CourseState/courses'];
            if(!users_courses || !courses) {
                return [];
            }

            // filter by status
            let data = users_courses.filter(item => this.filterStatuses.includes(item.status));

            // filter by user
            data = data.filter(item => item.user_id === Number(this.$route.params.userID));

            // add user name
            data.forEach((item) => {
                const course = courses.find(course => course.id === item.course_id)
                item.course_name = course ? course.name : 'Unknown';
            });
            
            return data;
        },

        isLoading() {
            return !this.$store.getters['UserCourseState/users_courses'];
        },

        createLink() {
            return '/users/users-courses/new?user_id=' + this.$route.params.userID;
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('CourseState/deleteCourses', data)
        },

        viewItem(item) {
            this.$router.push('/users/users-courses/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        }
    }
}
</script>

<style scoped>
</style>