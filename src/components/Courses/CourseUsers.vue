<template>
    <v-container fluid>
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
                { text: 'User Name',        value: 'full_name' },
                { text: 'Finished Lessons', value: 'finished_lessons_count' },
                { text: 'Status',           value: 'status' },
                { text: 'Cost',             value: 'price' },
                { text: 'Discount',         value: 'discount' },
                // { text: 'Days Extended',    value: 'days_axtended' },
                { text: 'Started At',       value: 'created_at' },
                { text: 'Expired At',       value: 'end_at' },
                { text: 'Status',           value: 'status',        align: 'right' },
                { text: 'Actions',          value: 'actions',       align: 'right' },
            ],
            search: '',
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        users_courses() {
            const users_courses = this.$store.getters['UserCourseState/users_courses'];
            const users         = this.$store.getters['UserState/users'];
            if(!users_courses || !users) {
                return [];
            }

            // filter by status
            let data = users_courses.data.filter(item => this.filterStatuses.includes(item.status));

            // filter by course
            data = data.filter(item => item.course_id === Number(this.$route.params.courseID));

            // add user name
            data.forEach((item) => {
                const user = users.data.find(user => user.id === item.user_id)
                item.full_name = user ? user.full_name : 'Unknown';
            });
            
            return data;
        },

        isLoading() {
            return !this.$store.getters['UserCourseState/users_courses'];
        },

        createLink() {
            return '/users/users-courses/new?course_id=' + this.$route.params.courseID;
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