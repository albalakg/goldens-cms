<template>
    <v-container fluid>
        <TopCard 
            text="Orders"
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="orders"
            :loading="loadingOrders"
            :filterStatus="statuses"
            viewable
            searchable
            mainField="name"
            @view="viewItem"
            @filterByStatus="filterByStatus"
        />
    </v-container>
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
                { text: 'Order ID',     value: 'order_number' },
                { text: 'User',         value: 'full_name' },
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
            let orders      = this.$store.getters['OrderState/orders'];
            const users     = this.$store.getters['UserState/users'];
            const courses   = this.$store.getters['CourseState/courses'];

            if(!orders) {
                return [];
            }
                
            // filter by status
            orders = orders.filter(order => this.filterStatuses.includes(order.status))
            
            orders.forEach(item => {
                const user = users.find(user => user.id === item.user_id);
                if(user) {
                    item.full_name  = user.full_name;
                    item.user_id    = user.id;
                }

                const course = courses.find(course => course.id === item.content_id);
                if(course) {
                    item.course_name    = course.name;
                    item.course_id      = course.id;
                }
            });

            return orders;
        },

        loadingOrders() {
            return !this.$store.getters['OrderState/orders'];
        }
    },

    methods: {
        viewItem(item) {
            this.$router.push('/orders/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('OrderState/getOrders');
        }
    }
}
</script>

<style scoped>
</style>