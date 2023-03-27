<template>
    <v-card class="pa-5">
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Support Number
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{
                            supportTicket.support_number
                        }}                        
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Support Catgory
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <router-link :to="`/support/categories/show/${category.id}`">
                            {{category.name}}
                        </router-link>                       
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        {{ user ? 'User' : 'Guest'}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <router-link v-if="user" :to="`/users/show/${user.id}`">
                            {{user.full_name}}
                        </router-link>
                        <span v-else>
                            {{ supportTicket.full_name }}
                        </span>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Description
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{
                            supportTicket.description
                        }} 
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Created Time
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{
                            supportTicket.created_at
                        }} 
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item vif>
                <v-list-item-content>
                    <v-list-item-title>
                        File Attached
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <img v-if="supportTicket.file_path" :src="supportTicket.file_path" alt="">
                        <span v-else>
                            No File Attached
                        </span>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Status
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <v-form>
                            <v-flex d-flex>
                                <v-flex xs11>
                                    <v-select
                                        outlined
                                        :items="statuses"
                                        item-text="text"
                                        item-value="value"
                                        v-model="form.status"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs1 class="ml-5">
                                    <SubmitButton 
                                        :disabled="canSubmit"
                                        :title="canSubmit ? 'Need to change the status to update' : ''"
                                        text="Update"
                                        :height="55"
                                        :loading="loading"
                                        @submit="submit()"
                                    />
                                </v-flex>
                            </v-flex>
                        </v-form>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>   
    </v-card>
</template>

<script>
import { PROGRESS_SELECTION } from '../../../helpers/Status'
import SubmitButton from '../../Buttons/SubmitButton.vue'

export default {
    components: {
        SubmitButton
    },

    props: {
        supportTicket: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            form: {
                status: null
            },
            loading: false,
            statuses: PROGRESS_SELECTION
        }
    },

    computed: {
        user() {
            const users     = this.$store.getters['UserState/users'];
            if(!users) {
                return {}
            }
            return users.find(user => user.id === this.supportTicket.user_id);
        },

        category() {
            const categories     = this.$store.getters['SupportState/support_categories'];
            if(!categories) {
                return {};
            }
            return categories.find(category => category.id === this.supportTicket.support_category_id);
        },

        canSubmit() {
            return this.form.status === this.supportTicket.status;
        }
    },

    created() {
        this.form.status    = this.supportTicket.status
        this.form.id        = this.supportTicket.id
    },

    methods: {
        submit() {
            this.loading = true;
            this.$store.dispatch('SupportState/updateSupportTicketStatus', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Updated the Support Category's status successfully`
                    });
                }).catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the Support Category\'s status',
                        type: 'error',
                    });
                    this.form.status = this.supportTicket.status
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
}
</script>

<style scoped>
    .user_course_link {
        position: absolute;
        right: 2%;    
        z-index: 2;
    }
</style>