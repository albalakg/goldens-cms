<template>
    <v-container fluid class="support_show_wrapper">
        
        <div v-if="editedSupport">
            <TopCard 
                :text="'Support ' + editedSupport.support_number"
            />

            <br>
            
            <v-tabs vertical class="support_show_card" v-model="currentTab">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index" @click="setTab(index)">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :supportTicket="editedSupport" :is="tab.component" />
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
import SupportDetails from '../../../components/Support/SupportTickets/SupportTicketDetails.vue'
import SupportHistory from '../../../components/Support/SupportTickets/SupportTicketHistory.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        SupportDetails,
        SupportHistory,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'SupportDetails', 
                },
                { 
                    text: 'History', 
                    component: 'SupportHistory', 
                },
            ],
            editedSupport: null,
        }
    },

    created() {
        this.goToTab()
        this.getSupport();
    },

    watch: {
        support_tickets() {
            this.getSupport();
        }
    },

    computed: {
        support_tickets() {
            return this.$store.getters['SupportState/support_tickets'];
        }
    },

    methods: {
        async getSupport() {
            this.editedSupport = await this.$store.dispatch('SupportState/getSupport', this.$route.params.supportID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('SupportState/createSupport', this.form)
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Support ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/support_tickets')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the support',
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

    .support_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>