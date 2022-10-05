<template>
    <v-container fluid class="term_show_wrapper">
        
        <div v-if="editedTerm">
            <TopCard 
                :text="'Term ' + editedTerm.name"
            />

            <br>
            
            <v-tabs vertical class="term_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :term="editedTerm" :is="tab.component" />
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
import TermDetails from '../../../components/Terms/TermDetails.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        TermDetails,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'TermDetails', 
                },
            ],
            editedTerm: null,
        }
    },

    created() {
        return this.getTerm();
    },

    watch: {
        terms() {
            this.getTerm();
        }
    },

    computed: {
        terms() {
            return this.$store.getters['TermState/terms'];
        }
    },

    methods: {
        async getTerm() {
            this.editedTerm = await this.$store.dispatch('TermState/getTerm', this.$route.params.termID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('TermState/createTerm', this.form)
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Term ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/terms')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the term',
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

    .term_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>