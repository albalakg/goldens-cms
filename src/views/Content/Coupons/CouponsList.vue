<template>
    <v-container fluid>
        <TopCard 
            text="Coupons"
            createable
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="coupons"
            :loading="isLoading"
            :filterStatus="statuses"
            viewable
            deleteable
            searchable
            multiple
            mainField="code"
            @delete="deleteItem"
            @view="viewItem"
            @filterByStatus="filterByStatus"
        />
    </v-container>
</template>

<script>
import TopCard from '../../../components/Cards/TopCard.vue'
import TableCard from '../../../components/Cards/TableCard.vue'
import { STATUSES_SELECTION, STATUSES_VALUES } from '../../../helpers/Status'

export default {
    components: {
        TopCard,
        TableCard
    },

    data() {
        return {
            headers: [
                { text: 'Code',             value: 'code' },
                { text: 'Value',            value: 'coupon_value' },
                { text: 'Total Used',       value: 'orders' },
                { text: 'Created At',       value: 'created_at' },
                { text: 'Created By',       value: 'full_name' },
                { text: 'Status',           value: 'status',    align: 'right' },
                { text: 'Actions',          value: 'actions',   align: 'right' },
            ],
            search: '',
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        coupons() {
            let coupons     = this.$store.getters['CouponState/coupons'];
            const orders    = this.$store.getters['OrderState/orders'];
            const users     = this.$store.getters['UserState/users'];

            if(!coupons || !orders || !users) {
                return [];
            }

            coupons.forEach(coupon => {
                coupon.orders       = orders.filter(order => order.coupon_id === coupon.id).length;
                const user          = users.find(user => user.id === coupon.created_by);
                coupon.full_name    = user ? user.full_name : 'Unknown';
                coupon.user_id      = coupon.created_by;
            });

            // filter by status
            return coupons.filter(coupon => this.filterStatuses.includes(coupon.status))
        },

        isLoading() {
            return !this.$store.getters['CouponState/coupons'];
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('CouponState/deleteCoupons', data)
        },

        viewItem(item) {
            this.$router.push('/content/coupons/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('CouponState/getCoupons');
        }
    }
}
</script>

<style scoped>
</style>