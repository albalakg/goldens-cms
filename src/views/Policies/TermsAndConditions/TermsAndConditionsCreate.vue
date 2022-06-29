<template>
    <v-container fluid>
        <TopCard 
            text="Create Terms and Conditions"
        />
        
        <br>

        <v-form @submit.prevent="submit()" ref="form">
            <v-flex d-flex>
                <v-flex class="pr-5">
                    <FormCard
                        title="Details"
                    >
                        <template slot="content">
                            <v-flex d-flex justify-space-between flex-wrap>
                                <v-flex xs6 class="px-4">
                                    <VueEditor 
                                        v-model="form.content"
                                        placeholder="תנאי האתר..."
                                        class="text_editor"
                                    />
                                </v-flex>
                                <v-flex xs6 class="px-8 rtl wrap-text">
                                    <div class="w100" v-html="form.content"></div>
                                </v-flex>
                            </v-flex>
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
import {DESCRIPTION_RULE} from '../../../helpers/Rules' 
import {DESCRIPTION_MESSAGE} from '../../../helpers/Messages' 
import { VueEditor } from "vue2-editor";

export default {
    components: {
        FormCard,
        TopCard,
        SubmitButton,
        CancelButton,
        VueEditor,
    },

    data() {
        return {
            form: {
                content:    '',
            },
            image: null,
            loading: false,
            errors: null,
            rules: {
                content:    v => DESCRIPTION_RULE.test(v)    || DESCRIPTION_MESSAGE,
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
            
            this.$store.dispatch('PoliciesState/createTermsAndConditions', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Terms and Condition created successfully`
                    });
                    this.$router.push('/policies/terms-and-conditions')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the Terms and Condition',
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
