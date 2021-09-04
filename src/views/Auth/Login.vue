<template>
    <v-flex class="login_wrapper">
        <v-flex d-flex align-center md10 lg6 xl4 mx-auto>
            <v-card class="pa-5 w100 login_card text-center">
                <div>
                    <h2 class="font_title">
                        LOGIN TO
                    </h2>
                    <h1 class="font_title">
                        GOLDENS
                    </h1>
                </div>
                <br>
                <v-form class="px-10" @submit.prevent="submit()" ref="form">
                    <v-text-field
                        label="Email"
                        v-model="form.email"
                        outlined
                        :rules="[rules.email]"
                    ></v-text-field>
                    <v-text-field
                        type="password"
                        label="Password"
                        v-model="form.password"
                        outlined
                        :rules="[rules.password]"
                    ></v-text-field>
                    <v-flex>
                    <PrimaryButton
                        text="Login"
                        type="submit"
                        @submit="submit"
                        :loading="loading"
                        :disabled="disabled"
                    />
                    </v-flex>
                    <br>
                    <v-alert 
                        :type="messageType" 
                        :value="!!message"
                        text
                        border="left"
                    >
                        {{message}}
                    </v-alert>
                    
                </v-form>
            </v-card>
        </v-flex>
    </v-flex>
</template>

<script>
import PrimaryButton from './../../components/Buttons/PrimaryButton.vue';
import Rules from './../../helpers/Rules' 

const EMAIL_RULE = Rules.email();
export default {
    components: {
        PrimaryButton
    },

    data() {
        return {
            form: {
                email: '',
                password: '',
            },
            loading: false,
            disabled: false,
            messageType: 'success',
            message: '',
            rules: {
                email: v => EMAIL_RULE.test(v) || 'Email is is not valid',
                password: v => !!v || 'Password is required'
            },
        }
    },

    methods: {
        submit() {
            this.message = '';

            if(!this.$refs.form.validate()) {
                return;
            }
            
            this.setLoading(true);
            axios.post('auth/login', this.form)
                 .then(res => {
                    this.messageType = 'success';
                    if(res.data && res.data.data && res.data.data.user_data) {
                        this.message = `Welcome ${res.data.data.user_data.first_name} ${res.data.data.user_data.last_name}`;
                    }
                    Auth.login(res.data.data);
                    this.loggedSuccessfully();

                }).catch(err => {
                    this.messageType = 'error';
                    this.message = err.response.data.message;
                }).finally(() => {
                    this.setLoading(false);
                })
        },

        loggedSuccessfully() {
            this.$store.dispatch('AppState/updateLogState', true);
            this.$router.push('/dashboard');
        },

        setLoading(status) {
            this.loading = status;
            this.disabled = status;
        }
    }
}
</script>

<style scoped>

    .login_wrapper {
        height: 100vh;
        width: 100vw;
    }

    .login_card {
        height: 50vh;
    }

</style>