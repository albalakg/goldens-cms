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
                                v-model="course"
                                label="Course"
                                readonly
                            ></v-text-field>

                            <v-text-field
                                outlined
                                v-model="form.link"
                                label="Link"
                                readonly
                                append-icon="mdi-content-copy"
                                @click:append="copyLink()"
                                :hint="linkHint"
                                persistent-hint
                            ></v-text-field>

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
                                readonly
                                outlined
                                v-model="form.fee"
                                label="Fee"
                                hint="fee in %"
                                autocomplete="off"
                                :rules="[rules.fee]"
                            ></v-text-field>

                            <v-select
                                outlined
                                :items="statuses"
                                item-text="text"
                                item-value="value"
                                v-model="form.status"
                                label="Status"
                                counter
                            ></v-select>
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
import { STATUSES_SELECTION } from '../../helpers/Status'
import {NAME_RULE, PHONE_RULE, EMAIL_RULE, FEE_RULE} from '../../helpers/Rules' 
import {NAME_MESSAGE, PHONE_MESSAGE, EMAIL_MESSAGE, FEE_MESSAGE} from '../../helpers/Messages'

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
                name:   '',
                email:  '',
                phone:  '',
                fee:    '',
                status: '',
            },
            linkHint: '',
            loading: false,
            errors: null,
            rules: {
                name:   v => NAME_RULE.test(v)  || NAME_MESSAGE,
                email:  v => EMAIL_RULE.test(v) || EMAIL_MESSAGE,
                phone:  v => PHONE_RULE.test(v) || PHONE_MESSAGE,
                fee:    v => FEE_RULE.test(v)   || FEE_MESSAGE,
            },
            statuses: STATUSES_SELECTION,
        }
    },

    computed: {
        course() {
            const courses = this.$store.getters['CourseState/courses'];
            if(!courses) {
                return '';
            }

            const course = courses.find(course => course.id === this.form.course_id);
            return course ? course.name : 'לא נמצא הקורס';
        },
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
                .then(() => {
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
        },

        copyLink() {
            navigator.clipboard.writeText(this.form.link);
            this.linkHint = 'הקישור הועתק';
            setTimeout(() => {
                this.linkHint = '';
            }, 3000);
        }
    }
}
</script>

<style scoped>
</style>