<template>
    <v-container fluid>
        <TableCard :headers="headers" :items="orders" :filterStatus="statuses" viewable searchable mainField="name"
            @view="viewItem" @filterByStatus="filterByStatus" />

        <FormCard title="Summary">
            <template slot="content">
                <v-flex md4 d-block class="ml-3 pb-5">

                    <v-select
                        :items="months"
                        v-model="month"
                        label="Month"
                        outlined
                    ></v-select>
                    ₪
                    {{ 
                        totalOrdersFeePerMonth
                    }}
                </v-flex>
            </template>
        </FormCard>
    </v-container>
</template>

<script>
import TableCard from '../Cards/TableCard.vue';
import FormCard from '../Cards/FormCard.vue'
import { ORDER_SELECTION, ORDER_VALUES } from '../../helpers/Status'

export default {
    props: {
        marketing: {
            type: Object,
            required: true
        }
    },

    components: {
        TableCard,
        FormCard,
    },

    data() {
        return {
            loading: false,
            errors: null,
            headers: [
                { text: 'Order ID', value: 'order_number' },
                { text: 'User', value: 'full_name' },
                { text: 'Course', value: 'course_name' },
                { text: 'Price', value: 'price' },
                { text: 'Fee Price', value: 'order_fee' },
                { text: 'Created At', value: 'created_at' },
                { text: 'Coupon', value: 'coupon_code' },
                { text: 'Status', value: 'status', align: 'right' },
                { text: 'Actions', value: 'actions', align: 'right' },
            ],
            statuses: ORDER_SELECTION,
            filterStatuses: ORDER_VALUES,
            month: 'Jan'
        }
    },

    computed: {
        orders() {
            let orders = this.$store.getters['OrderState/orders'];
            const users = this.$store.getters['UserState/users'];
            const courses = this.$store.getters['CourseState/courses'];
            const coupons = this.$store.getters['CouponState/coupons'];

            if (!orders || !users || !courses || !coupons) {
                return [];
            }

            // filter by status
            orders = orders.filter(order => this.filterStatuses.includes(order.status))

            // filter by marketing
            orders = orders.filter(order => order.marketing_token_id === this.marketing.id)

            orders.forEach(item => {
                const user = users.find(user => user.id === item.user_id);
                if (user) {
                    item.full_name = user.full_name;
                    item.user_id = user.id;
                }

                const course = courses.find(course => course.id === item.content_id);
                if (course) {
                    item.course_name = course.name;
                    item.course_id = course.id;
                }

                const coupon = coupons.find(coupon => coupon.id === item.coupon_id);
                item.coupon_code = coupon ? coupon.code : 'None'

                if (item.marketing_token_id === this.marketing.id) {
                    item.order_fee = item.price * (this.marketing.fee / 100);
                }
            });

            return orders;
        },

        months() {
            return DateService.getMonths()
        },

        totalOrdersFeePerMonth() {
            const ordersByChosenMonth = this.orders.filter(order => {
                const orderDateAsNumber = DateService.getMonthByDate(order.created_at);
                if(this.months[orderDateAsNumber] === this.month) {
                    return order
                }
            })
            
            return ordersByChosenMonth.reduce((total, order) => {
                return total + order.order_fee;
            }, 0);
        },
    },
    
    created() {
        this.month = DateService.getLastMonth();
    },

    methods: {
        viewItem(item) {
            this.$router.push('/orders/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },
    }
}
</script>

<style scoped></style>