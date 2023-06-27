<template>
    <v-container fluid>
        <TopCard 
            text="Create Marketing"
        />
        
        <br>

        <v-form @submit.prevent="submit()" ref="form">
            <v-flex d-flex>
                <v-flex xs12 lg6 class="pr-5">
                    <FormCard
                        title="Details"
                    >
                        <template slot="content">
                            <div class="px-4">
                                <v-autocomplete
                                    outlined
                                    :items="courses"
                                    :loading="!courses.length"
                                    item-text="name"
                                    item-value="id"
                                    v-model="form.course_id"
                                    label="Course"
                                    :rules="[rules.course_id]"
                                ></v-autocomplete>

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
                                    maxlength="100"
                                    label="Phone"
                                    :rules="[rules.phone]"
                                ></v-text-field>

                                <v-text-field
                                    outlined
                                    v-model="form.fee"
                                    label="Fee"
                                    hint="fee in %"
                                    max="100"
                                    type="number"
                                    autocomplete="off"
                                    :rules="[rules.fee]"
                                ></v-text-field>
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
import {ID_RULE, NAME_RULE, PHONE_RULE, EMAIL_RULE, FEE_RULE} from '../../../helpers/Rules' 
import {COURSE_MESSAGE, NAME_MESSAGE, PHONE_MESSAGE, EMAIL_MESSAGE, FEE_MESSAGE} from '../../../helpers/Messages'

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
                course_id:  '',
                name:       '',
                email:      '',
                phone:      '',
                fee:        '',
            },
            loading: false,
            errors: null,
            rules: {
                course_id:  v => ID_RULE.test(v)    || COURSE_MESSAGE,
                name:       v => NAME_RULE.test(v)  || NAME_MESSAGE,
                email:      v => EMAIL_RULE.test(v) || EMAIL_MESSAGE,
                phone:      v => PHONE_RULE.test(v) || PHONE_MESSAGE,
                fee:        v => FEE_RULE.test(v)   || FEE_MESSAGE,
            },
        }
    },

    computed: {
        courses() {
            const courses = this.$store.getters['CourseState/courses'];
            return courses ? courses : [];
        },
    },

    methods: {
        submit() {
            this.errors = null;
            
            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            this.$store.dispatch('MarketingState/createMarketing', this.form)
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Marketing ${this.form.name} created successfully`
                    });
                    this.$router.push('/content/marketings')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the Marketing',
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
</style>