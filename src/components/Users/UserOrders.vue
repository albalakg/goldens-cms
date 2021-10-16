<template>
    <div>
        <TopCard 
            text="User's Order Tickets"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="orders"
            :loading="isLoading"
            :filterStatus="statuses"
            viewable
            searchable
            mainField="name"
            @view="viewItem"
            @filterByStatus="filterByStatus"
        />
    </div>
</template>

<script>
import TopCard from '../../components/Cards/TopCard.vue'
import TableCard from '../../components/Cards/TableCard.vue'
import { ORDER_SELECTION, STATUSES_VALUES } from '../../helpers/Status'

export default {
    components: {
        TopCard,
        TableCard
    },

    data() {
        return {
            headers: [
                { text: 'Order Number', value: 'order_number' },
                { text: 'Course',       value: 'course_name' },
                { text: 'Price',        value: 'price' },
                { text: 'Created At',   value: 'created_at' },
                { text: 'Status',       value: 'status',    align: 'right' },
                { text: 'Actions',      value: 'actions',   align: 'right' },
            ],
            search: '',
            statuses: ORDER_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        orders() {
            const orders    = this.$store.getters['OrderState/orders'];
            const courses   = this.$store.getters['CourseState/courses'];
            if(!orders || !courses) {
                return [];
            }

            // filter by status
            let data = orders.filter(item => this.filterStatuses.includes(item.status));

            // filter by user
            data = data.filter(item => item.user_id === Number(this.$route.params.userID));

            data.forEach(item => {
                const course = courses.find(course => course.id === item.content_id);
                if(course) {
                    item.course_name    = course.name;
                    item.course_id      = course.id;
                }
            });
            
            return data;
        },

        isLoading() {
            return !this.$store.getters['OrderState/orders'];
        }
    },

    methods: {
       
        viewItem(item) {
            this.$router.push('/orders/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        }
    }
}
</script>

<style scoped>
</style>