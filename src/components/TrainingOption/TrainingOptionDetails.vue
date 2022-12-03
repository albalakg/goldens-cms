<template>
<v-form @submit.prevent="submit()" ref="form">
        <v-flex>
            <FormCard
            >
                <template slot="content">
                    <div class="px-4">
                        <v-text-field
                            outlined
                            v-model="form.name"
                            counter
                            maxlength="40"
                            label="Name"
                            class="pr-2"
                            :rules="[rules.name]"
                        ></v-text-field>
                    </div>
                </template>
            </FormCard>
        </v-flex>
        <v-flex d-flex justify-space-between class="mt-10">
            <v-flex md12 lg6 class="pr-5">
                <CancelButton 
                    goBack
                />
            </v-flex>
            <v-flex md12 lg6 class="pl-5">
                <SubmitButton
                    :loading="loading"
                    @submit="submit()"
                />
            </v-flex>
        </v-flex>
    </v-form>
</template>

<script>
import FormCard from '../Cards/FormCard.vue'
import SubmitButton from '../Buttons/SubmitButton.vue'
import CancelButton from '../Buttons/CancelButton.vue'
import {TRAINING_OPTION_NAME_RULE} from '../../helpers/Rules' 
import {NAME_MESSAGE} from '../../helpers/Messages' 

export default {
    props: {
        trainingOption: {
            type: Object,
            required: true
        }
    },

    components: {
        FormCard,
        SubmitButton,
        CancelButton,
    },

    data() {
        return {
            form: {
                name:   '',
            },
            loading: false,
            errors: null,
            rules: {
                name: v => TRAINING_OPTION_NAME_RULE.test(v) || NAME_MESSAGE,
            },
        }
    },

    created() {
        this.form = {...this.trainingOption};
    },

    methods: {
        submit() {
            this.errors = null;
            
            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            this.$store.dispatch('TrainingOptionState/updateTrainingOption', this.form)
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Training Option ${this.form.name} updated successfully`
                    });
                    this.$router.push('/content/training-options')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the training Option',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    }
}
</script>

<style scoped>

.preview_trainingOption {
    width: 30%;
}

</style>