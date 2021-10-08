<template>
    <v-container fluid class="support_show_wrapper">
        
        <div v-if="editedSupportCategory">
            <TopCard 
                :text="'Support Category ' + editedSupportCategory.name"
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
                            <component :supportCategory="editedSupportCategory" :is="tab.component" />
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
import SupportCategoryDetails from '../../../components/Support/SupportCategories/SupportCategoryDetails.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        SupportCategoryDetails,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'SupportCategoryDetails', 
                },
            ],
            editedSupportCategory: null,
        }
    },

    created() {
        return this.getSupport();
    },

    watch: {
        support_categories() {
            this.getSupport();
        }
    },

    computed: {
        support_categories() {
            return this.$store.getters['SupportState/support_categories'];
        }
    },

    methods: {
        async getSupport() {
            this.editedSupportCategory = await this.$store.dispatch('SupportState/getSupportCategory', this.$route.params.supportCategoryID);
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