<template>
    <v-container fluid class="support_show_wrapper">
        
        <div v-if="editedSupport">
            <TopCard 
                :text="'Support ' + editedSupport.full_name"
            />

            <br>
            
            <v-tabs vertical class="support_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :support="editedSupport" :is="tab.component" />
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
import SupportDetails from '../../../components/Support/SupportDetails.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        SupportDetails,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'SupportDetails', 
                },
            ],
            editedSupport: null,
        }
    },

    created() {
        return this.getSupport();
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
                .then(res => {
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
        }
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