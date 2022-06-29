<template>
    <v-container fluid class="terms_and_condition_show_wrapper">
        
        <div v-if="editedTermsAndCondition">
            <TopCard 
                :text="'Terms and Condition | ID: ' + editedTermsAndCondition.id + ' | ' + editedTermsAndCondition.created_at"
            />

            <br>
            
            <v-tabs vertical class="terms_and_condition_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :termsAndCondition="editedTermsAndCondition" :is="tab.component" />
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
import TermsAndConditionsPreview from '../../../components/TermsAndConditions/TermsAndConditionsPreview.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        TermsAndConditionsPreview,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Preview', 
                    component: 'TermsAndConditionsPreview', 
                },
            ],
            editedTermsAndCondition: null,
        }
    },

    created() {
        return this.getTermsAndCondition();
    },

    watch: {
        termsAndConditions() {
            this.getTermsAndCondition();
        }
    },

    computed: {
        termsAndConditions() {
            return this.$store.getters['PoliciesState/termsAndConditions'];
        }
    },

    methods: {
        async getTermsAndCondition() {
            this.editedTermsAndCondition = this.termsAndConditions.find( item => item.id == this.$route.params.termAndConditionID);
        },
    }
}
</script>

<style scoped>

    .terms_and_condition_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>