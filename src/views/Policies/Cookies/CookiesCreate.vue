<template>
    <v-container fluid>
        <TopCard 
            text="Create Cookie"
        />
        
        <br>

        <v-form @submit.prevent="submit()" ref="form">
            <v-flex d-flex>
                <v-flex class="pr-5">
                    <FormCard
                        title="Details"
                    >
                        <template slot="content">
                            <div class="px-4">
                                <v-text-field
                                    outlined
                                    v-model="form.name"
                                    label="Name"
                                    counter
                                    maxlength="30"
                                    :error-messages="errorName"
                                    :rules="[rules.name]"
                                ></v-text-field>
                                <v-textarea
                                    outlined
                                    v-model="form.description"
                                    counter
                                    maxlength="1000"
                                    label="Description"
                                    :rules="[rules.description]"
                                ></v-textarea>
                            </div>
                        </template>
                    </FormCard>
                </v-flex>
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

    </v-container>
</template>

<script>
import FormCard from '../../../components/Cards/FormCard.vue'
import TopCard from '../../../components/Cards/TopCard.vue'
import SubmitButton from '../../../components/Buttons/SubmitButton.vue'
import CancelButton from '../../../components/Buttons/CancelButton.vue'
import {NAME_RULE, DESCRIPTION_RULE, ID_RULE} from '../../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, CATEGORY_MESSAGE} from '../../../helpers/Messages' 

export default {
    components: {
        FormCard,
        TopCard,
        SubmitButton,
        CancelButton,
    },

    data() {
        return {
            form: {
                name:           '',
                description:    '',
                course_id:    '',
            },
            image: null,
            loading: false,
            errors: null,
            rules: {
                name:           v => NAME_RULE.test(v)           || NAME_MESSAGE,
                description:    v => DESCRIPTION_RULE.test(v)    || DESCRIPTION_MESSAGE,
            },
        }
    },

    computed: {
        errorName() {
            return this.errors && this.errors.name ? this.errors.name[0] : '';
        }
    },

    methods: {
        submit() {
            this.errors = null;
            
            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('PoliciesState/createCookie', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Cookie ${this.form.name} created successfully`
                    });
                    this.$router.push('/policies/cookies')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the Cookie',
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
