<template>
    <v-container fluid>
        <v-form @submit.prevent="submit()" ref="form">
            <v-flex d-flex>
                <v-flex xs12 lg6 class="pr-5">
                    <FormCard
                        title="Details"
                    >
                        <template slot="content">
                            <v-text-field
                                outlined
                                v-model="form.name"
                                counter
                                maxlength="40"
                                label="Name"
                                :rules="[rules.name]"
                            ></v-text-field>

                            <v-text-field
                                outlined
                                v-model="form.email"
                                counter
                                maxlength="100"
                                label="Email"
                                :rules="[rules.email]"
                            ></v-text-field>

                            <v-text-field
                                outlined
                                v-model="form.phone"
                                counter
                                maxlength="13"
                                label="Phone"
                                :rules="[rules.phone]"
                            ></v-text-field>

                            <v-text-field
                                outlined
                                v-model="form.discount"
                                label="Discount"
                                hint="discount in ₪"
                                autocomplete="off"
                                :rules="[rules.discount]"
                            ></v-text-field>
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
import FormCard from '../Cards/FormCard.vue'
import SubmitButton from '../Buttons/SubmitButton.vue'
import CancelButton from '../Buttons/CancelButton.vue'
import {NAME_RULE, PHONE_RULE, EMAIL_RULE, DISCOUNT_RULE} from '../../helpers/Rules' 
import {NAME_MESSAGE, PHONE_MESSAGE, EMAIL_MESSAGE, DISCOUNT_MESSAGE} from '../../helpers/Messages'

export default {
    props: {
        marketing: {
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
                name:           '',
                email:          '',
                phone:          '',
                discount:       '',
            },
            loading: false,
            errors: null,
            rules: {
                name:           v => NAME_RULE.test(v)                  || NAME_MESSAGE,
                email:          v => EMAIL_RULE.test(v)                 || EMAIL_MESSAGE,
                phone:          v => PHONE_RULE.test(v)                 || PHONE_MESSAGE,
                discount:       v => DISCOUNT_RULE.test(v)              || DISCOUNT_MESSAGE,
            },
        }
    },

    created(){
        this.form = {...this.marketing};
    },

    methods: {
        submit() {
            this.errors = null;
            
            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            this.$store.dispatch('MarketingState/updateMarketing', {...this.form, course_id: this.course_id})
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Marketing ${this.form.name} updated successfully`
                    });
                    this.$router.push('/content/marketings')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the marketing',
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
</style>