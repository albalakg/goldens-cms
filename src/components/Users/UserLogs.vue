<template>
    <div>
        <TopCard 
            text="User's Logs History"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="logs"
            :loading="isLoading"
            viewable
            searchable
            mainField="created_at"
            @view="viewItem"
        />
    </div>
</template>

<script>
import TopCard from '../../components/Cards/TopCard.vue'
import TableCard from '../../components/Cards/TableCard.vue'

export default {
    props: {
        user: {
            required: true,
            type: Object
        }
    }, 

    components: {
        TopCard,
        TableCard
    },

    data() {
        return {
            headers: [
                { text: 'Status',   value: 'login_status'},
                { text: 'Date',     value: 'created_at'},
                { text: 'Browser',  value: 'user_agent'},
                { text: 'IP',       value: 'ip'},
            ],
            search: '',
        }
    },
    
    created() {
        this.$store.dispatch('UserState/getLogsHistory', this.user.id);
    },

    computed: {
        logs() {
            const logs    = this.$store.getters['UserState/users'];
            const courses = this.$store.getters['CourseState/courses'];
            if(!logs || !courses) {
                return [];
            }

            // filter by user
            const user = logs.find(item => item.user_id === this.user.id);
            
            return user.logsHistory ?? [];
        },

        isLoading() {
            return !this.$store.getters['LogState/logs'];
        }
    },

    methods: {
       
        viewItem(item) {
            this.$router.push('/logs/show/' + item.id)
        },
    }
}
</script>

<style scoped>
</style>