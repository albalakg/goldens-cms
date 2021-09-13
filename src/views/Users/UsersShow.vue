<template>
    <v-container fluid class="user_show_wrapper">
        
        <div v-if="editedUser">
            <TopCard 
                :text="'User ' + editedUser.full_name"
            />

            <br>
            
            <v-tabs vertical class="user_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :user="editedUser" :is="tab.component" />
                        </div>
                    </v-tab-item>
                </template>
            </v-tabs>
        </div>

        <FormLoader v-else />

    </v-container>
</template>

<script>
import FormLoader from '../../components/Loaders/FormLoader.vue'
import TopCard from '../../components/Cards/TopCard.vue'
import UserDetails from '../../components/Users/UserDetails.vue'
import UserSecurity from '../../components/Users/UserSecurity.vue'
import UserSupport from '../../components/Users/UserSupport.vue'
import UserOrders from '../../components/Users/UserOrders.vue'
import UserActivity from '../../components/Users/UserActivity.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        UserDetails,
        UserSecurity,
        UserSupport,
        UserOrders,
        UserActivity,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'UserDetails', 
                },
                { 
                    text: 'Security', 
                    component: 'UserSecurity', 
                },
                { 
                    text: 'Support', 
                    component: 'UserSupport', 
                },
                { 
                    text: 'Orders', 
                    component: 'UserOrders', 
                },
                { 
                    text: 'Activity', 
                    component: 'UserActivity', 
                },
            ],
            editedUser: null,
        }
    },

    created() {
        return this.getUser();
    },

    watch: {
        users() {
            this.getUser();
        }
    },

    computed: {
        users() {
            return this.$store.getters['UserState/users'];
        }
    },

    methods: {
        async getUser() {
            this.editedUser = await this.$store.dispatch('UserState/getUser', this.$route.params.userID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('UserState/createUser', this.form)
                .then(res => {
                    console.log('res', res);
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `User ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/users')
                })
                .catch(err => {
                    console.log('err', err);
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

    .user_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>