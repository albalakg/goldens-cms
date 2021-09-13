<template>
    <div>
        <v-form v-if="user" @submit.prevent="submit()" ref="form">
            <v-flex d-flex>
                <v-flex md12 >
                    <FormCard
                        title="Private Details"
                    >
                        <template slot="content">
                            <div class="px-4">
                                <v-flex d-flex>
                                    <v-text-field
                                        outlined
                                        v-model="form.first_name"
                                        label="First Name"
                                        class="pr-2"
                                        :rules="[rules.first_name]"
                                    ></v-text-field>
                                    <v-text-field
                                        class="pl-2"
                                        outlined
                                        v-model="form.last_name"
                                        label="Last Name"
                                        :rules="[rules.last_name]"
                                    ></v-text-field>
                                </v-flex>
                                <v-text-field
                                    outlined
                                    v-model="form.phone"
                                    label="Phone"
                                    :rules="[rules.phone]"
                                    :error-messages="phoneErrorMessage"
                                ></v-text-field>
                                <v-select
                                    outlined
                                    :items="genders"
                                    item-text="text"
                                    item-value="value"
                                    v-model="form.gender"
                                    label="Gender"
                                    clearable
                                ></v-select>
                                <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :return-value.sync="date"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        outlined
                                        v-model="date"
                                        label="Birthdate"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        clearable
                                    ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="date"
                                        no-title
                                        scrollable
                                    >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="menu = false"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="$refs.menu.save(date)"
                                    >
                                        OK
                                    </v-btn>
                                    </v-date-picker>
                                </v-menu>
                                <v-select
                                    outlined
                                    :items="statuses"
                                    item-text="text"
                                    item-value="value"
                                    v-model="form.status"
                                    label="Status"
                                ></v-select>
                            </div>
                            <v-flex d-flex justify-space-between class="mb-5 px-4">
                                <v-flex md12 lg6 class="pr-5">
                                    <CancelButton 
                                        @submit="cancel()"
                                    />
                                </v-flex>
                                <v-flex md12 lg6 class="pl-5">
                                    <SubmitButton
                                        :loading="loading"
                                        @submit="submit()"
                                    />
                                </v-flex>
                            </v-flex>
                        </template>
                    </FormCard>
                </v-flex>
            </v-flex>
        
            
        </v-form>

    </div>
</template>

<script>
import FormCard from './../Cards/FormCard.vue'
import SubmitButton from '../../components/Buttons/SubmitButton.vue'
import CancelButton from '../../components/Buttons/CancelButton.vue'
import {EMAIL_RULE, PHONE_RULE, PASSWORD_RULE, FIRST_NAME_RULE, LAST_NAME_RULE} from '../../helpers/Rules' 
import {EMAIL_MESSAGE, PHONE_MESSAGE, PASSWORD_MESSAGE, FIRST_NAME_MESSAGE, LAST_NAME_MESSAGE} from '../../helpers/Messages' 
import { STATUSES_SELECTION } from './../../helpers/Status'
const NORMAL_ROLE = 'Normal';
const ADMIN_ROLE = 'Admin';

export default {
    components: {
        FormCard,
        SubmitButton,
        CancelButton,
    },

    props: {
        user: {
            type: Object,
            required: true
        },
        
    },

    data() {
        return {
            form: {
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                gender: '',
                birth_date: '',
                role: '',
            },
            rules: {
                email: v => EMAIL_RULE.test(v) || EMAIL_MESSAGE,
                first_name: v => FIRST_NAME_RULE.test(v) || FIRST_NAME_MESSAGE,
                last_name: v => LAST_NAME_RULE.test(v) || LAST_NAME_MESSAGE,
                phone: (v) => PHONE_RULE.test(v) || PHONE_MESSAGE,
                password: (v) => PASSWORD_RULE.test(v) || PASSWORD_MESSAGE,
            },
            date: '',
            menu: false,
            loading: false,
            roles: [
                NORMAL_ROLE,
                ADMIN_ROLE
            ],
            errors: null,
            genders: [
                {
                    value: 1,
                    text: 'Male',
                },
                {
                    value: 2,
                    text: 'Female',
                },
                {
                    value: 3,
                    text: 'Other',
                },
            ],
            statuses: STATUSES_SELECTION
        }
    },

    created() {
        this.form = {...this.user};
        this.date = this.user.birth_date;
    },

    computed: {
        phoneErrorMessage() {
            return this.errors && this.errors.phone ? this.errors.phone[0] : '';
        },
    },

    methods: {
        cancel() {
            this.form = {...this.user};
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.form.birth_date = this.date;
            this.$store.dispatch('UserState/updateUser', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `User ${this.form.first_name} ${this.form.last_name} updated successfully`
                    });
                    this.$router.push('/users')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the user',
                        type: 'error',
                        time: 2000
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