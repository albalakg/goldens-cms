<template>
    <v-container fluid class="marketing_show_wrapper">
        
        <div v-if="editedMarketing">
            <TopCard 
                :text="'Marketing ' + editedMarketing.name"
            />

            <br>
            
            <v-tabs vertical class="marketing_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index" @click="setTab(index)">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :marketing="editedMarketing" :is="tab.component" />
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
import MarketingDetails from '../../../components/Marketings/MarketingDetails.vue'
import MarketingOrders from '../../../components/Marketings/MarketingOrders.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        MarketingDetails,
        MarketingOrders,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'MarketingDetails', 
                },
                { 
                    text: 'Orders', 
                    component: 'MarketingOrders', 
                },
            ],
            editedMarketing: null,
        }
    },

    created() {
        this.goToTab()
        this.getMarketing();
    },

    watch: {
        marketings() {
            this.getMarketing();
        }
    },

    computed: {
        marketings() {
            return this.$store.getters['MarketingState/marketings'];
        }
    },

    methods: {
        async getMarketing() {
            this.editedMarketing = await this.$store.dispatch('MarketingState/getMarketing', this.$route.params.marketingID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('MarketingState/createMarketing', this.form)
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Marketing ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/marketings')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the marketing',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        
        setTab(index) {
            this.$router.push(
                {
                    path: this.$route.path,
                    query: { 
                        tab: index
                    }
                }
            )
        },
        
        goToTab() {
            this.currentTab = Number(this.$route.query.tab);
        },
    }
}
</script>

<style scoped>

    .marketing_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>