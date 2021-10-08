<template>
    <v-container fluid class="order_show_wrapper">
        
        <div v-if="editedOrder">
            <TopCard 
                :text="'Order ' + editedOrder.order_number"
            />

            <br>
            
            <v-tabs vertical class="order_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :order="editedOrder" :is="tab.component" />
                        </div>
                    </v-tab-item>
                </template>
            </v-tabs>
        </div>

        <FormLoader v-else />

    </v-container>
</template>

<script>
import FormLoader from '../../components/Loaders/FormLoader.vue'
import TopCard from '../../components/Cards/TopCard.vue'
import OrderDetails from '../../components/Orders/OrdersDetails.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        OrderDetails,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'OrderDetails', 
                },
            ],
            editedOrder: null,
        }
    },

    created() {
        return this.getOrder();
    },

    watch: {
        orders() {
            this.getOrder();
        }
    },

    computed: {
        orders() {
            return this.$store.getters['OrderState/orders'];
        }
    },

    methods: {
        async getOrder() {
            this.editedOrder = await this.$store.dispatch('OrderState/getOrder', this.$route.params.orderID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('OrderState/createOrder', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Order ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/orders')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the order',
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

    .order_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>