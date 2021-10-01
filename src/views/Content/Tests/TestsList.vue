<template>
    <v-container fluid>
        <TopCard 
            text="Tests"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="tests"
            :loading="loadingTests"
            :filerStatus="statuses"
            viewable
            searchable
            multipleEdit
            :statusTexts="statusTexts"
            @view="viewItem"
            @filterByStatus="filterByStatus"
        />
    </v-container>
</template>

<script>
import TopCard from '../../../components/Cards/TopCard.vue'
import TableCard from '../../../components/Cards/TableCard.vue'
import { STATUSES_SELECTION, STATUSES_VALUES, PROGRESS_STATUSES } from '../../../helpers/Status'

export default {
    components: {
        TopCard,
        TableCard
    },

    data() {
        return {
            headers: [
                { text: 'User',         value: 'full_name' },
                { text: 'Course',       value: 'course_name' },
                { text: 'Video',        value: 'video' },
                { text: 'Comment',      value: 'comment' },
                { text: 'Created At',   value: 'created_at' },
                { text: 'Status',       value: 'status',    align: 'right' },
                { text: 'Actions',      value: 'actions',   align: 'right' },
            ],
            search: '',
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES, 
            statusTexts: PROGRESS_STATUSES
        }
    },

    computed: {
        tests() {
            let tests       = this.$store.getters['TestState/tests'];
            const users     = this.$store.getters['UserState/users'];
            const courses   = this.$store.getters['CourseState/courses'];

            if(!tests) {
                return [];
            }
            console.log('tests', tests);
            // filter by status
            const data = tests.data.filter(test => this.filterStatuses.includes(test.status))

            data.forEach(item => {
                const user = users.data.find(user => user.id === item.user_course.user_id);
                if(user) {
                    item.full_name  = user.full_name;
                    item.user_id    = user.id;
                }
                const course = courses.data.find(course => course.id === item.user_course.course_id);
                if(course) {
                    item.course_name    = course.name;
                    item.course_id      = course.id;
                }
            });

            return data;
        },

        loadingTests() {
            return !this.$store.getters['TestState/tests'];
        }
    },

    methods: {
        viewItem(item) {
            this.$router.push('/content/tests/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        }
    }
}
</script>

<style scoped>
</style>