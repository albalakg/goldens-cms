<template>
    <v-container fluid>
        <TopCard 
            text="Create User"
        />
        
        <br>

        <v-form @submit.prevent="submit()" ref="form">
            <v-flex d-flex>
                <v-flex xs12 lg6 class="pr-5">
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
                                        counter
                                        maxlength="30"
                                        class="pr-2"
                                        :rules="[rules.first_name]"
                                    ></v-text-field>
                                    <v-text-field
                                        class="pl-2"
                                        outlined
                                        v-model="form.last_name"
                                        counter
                                        maxlength="30"
                                        label="Last Name"
                                        :rules="[rules.last_name]"
                                    ></v-text-field>
                                </v-flex>
                                <v-text-field
                                    outlined
                                    v-model="form.phone"
                                    counter
                                    maxlength="13"
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
                                ></v-select>
                                <v-menu
                                    ref="menu"
                                    v-model="form.birth_date"
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
                            </div>
                        </template>
                    </FormCard>
                </v-flex>
                <v-flex xs12 lg6 class="pl-5">
                    <FormCard
                        title="Authentication Details"
                    >
                        <template slot="content">
                            <div class="px-4">
                                <v-text-field
                                    outlined
                                    v-model="form.email"
                                    label="Email"
                                    :rules="[rules.email]"
                                    :error-messages="emailErrorMessage"
                                    autocomplete="off"
                                ></v-text-field>
                                <v-text-field
                                    type="password"
                                    outlined
                                    v-model="form.password"
                                    :rules="[rules.password]"
                                    label="Password"
                                    autocomplete="off"
                                ></v-text-field>
                                <v-text-field
                                    type="password"
                                    outlined
                                    v-model="form.password_confirmation"
                                    :rules="[rules.password_confirmation]"
                                    label="Password Confirmation"
                                ></v-text-field>
                                <v-select
                                    outlined
                                    :items="roles"
                                    v-model="form.role"
                                    label="Role"
                                ></v-select>
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
import FormCard from './../../components/Cards/FormCard.vue'
import TopCard from './../../components/Cards/TopCard.vue'
import SubmitButton from './../../components/Buttons/SubmitButton.vue'
import CancelButton from './../../components/Buttons/CancelButton.vue'
import {EMAIL_RULE, PHONE_RULE, PASSWORD_RULE, FIRST_NAME_RULE, LAST_NAME_RULE} from './../../helpers/Rules' 
import {EMAIL_MESSAGE, PHONE_MESSAGE, PASSWORD_MESSAGE, PASSWORD_CONFIRMATION_MESSAGE, FIRST_NAME_MESSAGE, LAST_NAME_MESSAGE} from './../../helpers/Messages' 

const NORMAL_ROLE = 'Normal';
const ADMIN_ROLE = 'Admin';

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
                first_name: '',
                last_name:  '',
                email:      '',
                phone:      '',
                gender:     '',
                birth_date: '',
                role:       NORMAL_ROLE,
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
            rules: {
                email:                  v => EMAIL_RULE.test(v)                 || EMAIL_MESSAGE,
                first_name:             v => FIRST_NAME_RULE.test(v)            || FIRST_NAME_MESSAGE,
                last_name:              v => LAST_NAME_RULE.test(v)             || LAST_NAME_MESSAGE,
                phone:                  v => PHONE_RULE.test(v)                 || PHONE_MESSAGE,
                password:               v => PASSWORD_RULE.test(v)              || PASSWORD_MESSAGE,
                password_confirmation:  v => (!!v && v == this.form.password)   || PASSWORD_CONFIRMATION_MESSAGE,
            },
        }
    },

    computed: {
        emailErrorMessage() {
            return this.errors && this.errors.email ? this.errors.email[0] : '';
        },

        phoneErrorMessage() {
            return this.errors && this.errors.phone ? this.errors.phone[0] : '';
        },
    },

    methods: {
        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('UserState/createUser', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `User ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/users')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the user',
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