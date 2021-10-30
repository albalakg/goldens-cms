<template>
    <v-container fluid class="coupon_show_wrapper">
        
        <div v-if="coupon">
            <TopCard 
                :text="'Coupons ' + coupon.code"
            />

            <br>
            
            <v-tabs vertical class="coupon_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :coupon="coupon" :is="tab.component" />
                        </div>
                    </v-tab-item>
                </template>
            </v-tabs>
        </div>

        <FormLoader v-else />

    </v-container>
</template>

<script>
import FormLoader from '../../../components/Loaders/FormLoader.vue'
import TopCard from '../../../components/Cards/TopCard.vue'
import CouponDetails from '../../../components/Coupons/CouponDetails.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        CouponDetails,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'CouponDetails', 
                }
            ],
            coupon: null,
        }
    },

    created() {
        return this.getCoupon();
    },

    watch: {
        coupons() {
            this.getCoupon();
        }
    },

    computed: {
        coupons() {
            return this.$store.getters['CouponState/coupons'];
        }
    },

    methods: {
        async getCoupon() {
            this.coupon = await this.$store.dispatch('CouponState/getCoupon', this.$route.params.couponID);
            console.log('this.coupon', this.coupon);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('CouponState/createCoupon', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Coupon ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/coupons')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the coupon',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
}
</script>

<style scoped>

    .coupon_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>