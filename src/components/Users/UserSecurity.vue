<template>
    <div>
        <v-flex md4>
            <FormCard
                title="Update email"
            >
                <template slot="content">
                    <v-form class="pb-3" v-if="user" @submit.prevent="submitEmail()" ref="formEmail">
                        <v-text-field
                            outlined
                            v-model="form.email"
                            label="Email"
                            :rules="[rules.email]"
                            :error-messages="emailErrorMessage"
                            autocomplete="off"
                        ></v-text-field>
                        <SubmitButton
                            :loading="loadingEmail"
                            @submit="submitEmail()"
                        />
                    </v-form>
                </template>
            </FormCard>
        </v-flex>

        <br>

        <v-flex md4>
            <FormCard
                title="Update Password"
            >
                <template slot="content">
                    <v-form class="pb-3" v-if="user" @submit.prevent="submitPassword()" ref="formPassword">
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
                        <SubmitButton
                            :loading="loadingPassword"
                            @submit="submitPassword()"
                        />
                    </v-form>
                </template>
            </FormCard>
        </v-flex>
    </div>
</template>

<script>
import FormCard from './../Cards/FormCard.vue'
import SubmitButton from '../../components/Buttons/SubmitButton.vue'
import {EMAIL_RULE, PASSWORD_RULE,} from './../../helpers/Rules' 
import {EMAIL_MESSAGE, PASSWORD_MESSAGE, PASSWORD_CONFIRMATION_MESSAGE} from './../../helpers/Messages' 

export default {
    
    components: {
        FormCard,
        SubmitButton,
    },

    props: {
        user: {
            type: Object,
            required: true
        },
        
    },

    data() {
        return {
            loadingEmail: false,
            loadingPassword: false,
            form: {
                email:                  '',
                password:               '',
                password_confirmation:  ''
            },
            rules: {
                email: v                    => EMAIL_RULE.test(v)               || EMAIL_MESSAGE,
                password: v                 => PASSWORD_RULE.test(v)            || PASSWORD_MESSAGE,
                password_confirmation: (v)  => (!!v && v == this.form.password) || PASSWORD_CONFIRMATION_MESSAGE,
            },
        }
    },

    computed: {
        emailErrorMessage() {
            return this.errors && this.errors.email ? this.errors.email[0] : '';
        },
    },
    
    created() {
        this.form.email = this.user.email;
    },

    methods: {
        submitEmail() {
            this.errors = null;

            if(!this.$refs.formEmail.validate()) {
                return;
            }

            this.loadingEmail = true;

            this.$store.dispatch('UserState/updateEmail', { id: this.user.id, email: this.form.email })
                    .then(() => {
                        this.$store.dispatch('MessageState/addMessage', {
                            message: `${this.user.full_name}'s email updated successfully`
                        });
                    })
                    .catch(err => {
                        this.errors = err.errors;
                        this.$store.dispatch('MessageState/addMessage', {
                            message: 'Failed to update the user\'s email',
                            type: 'error'
                        });
                    })
                    .finally(() => {
                        this.loadingEmail = false;
                    });
        },

        submitPassword() {
            this.errors = null;

            if(!this.$refs.formPassword.validate()) {
                return;
            }

            this.loadingPassword = true;

            this.$store.dispatch('UserState/updatePassword', { 
                        id: this.user.id,
                        password: this.form.password,
                        password_confirmation: this.form.password_confirmation,
                    })
                    .then(() => {
                        this.$store.dispatch('MessageState/addMessage', {
                            message: `${this.user.full_name}'s password updated successfully`
                        });
                    })
                    .catch(err => {
                        this.errors = err.errors;
                        this.$store.dispatch('MessageState/addMessage', {
                            message: 'Failed to update the user\'s password',
                            type: 'error'
                        });
                    })
                    .finally(() => {
                        this.loadingPassword = false;
                    });
        },

    }
}
</script>

<style scoped>

</style>