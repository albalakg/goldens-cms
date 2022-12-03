<template>
    <v-container fluid class="training_option_show_wrapper">
        
        <div v-if="editedTrainingOption">
            <TopCard 
                :text="'Training Option ' + editedTrainingOption.name"
            />

            <br>
            
            <v-tabs vertical class="training_option_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :trainingOption="editedTrainingOption" :is="tab.component" />
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
import TrainingOptionDetails from '../../../components/TrainingOption/TrainingOptionDetails.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        TrainingOptionDetails,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'TrainingOptionDetails', 
                },
            ],
            editedTrainingOption: null,
        }
    },

    created() {
        return this.getTrainingOption();
    },

    watch: {
        training_options() {
            this.getTrainingOption();
        }
    },

    computed: {
        training_options() {
            return this.$store.getters['TrainingOptionState/training_options'];
        }
    },

    methods: {
        async getTrainingOption() {
            this.editedTrainingOption = await this.$store.dispatch('TrainingOptionState/getTrainingOption', this.$route.params.trainingOptionID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('TrainingOptionState/createTrainingOption', this.form)
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `TrainingOption ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/training-options')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the training_option',
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

    .training_option_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>