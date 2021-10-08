<template>
    <v-card class="pa-5">
        <v-list>
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
import { PROGRESS_SELECTION } from '../../helpers/Status'
import SubmitButton from '../Buttons/SubmitButton.vue'

export default {
    components: {
        SubmitButton
    },

    props: {
        supportCategory: {
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
            return users.find(user => user.id === this.supportCategory.user_course.user_id);
        },

        course() {
            const courses   = this.$store.getters['CourseState/courses'];
            return courses.find(course => course.id === this.supportCategory.user_course.course_id);
        },
    },

    created() {
        this.form.status    = this.supportCategory.status
        this.form.id        = this.supportCategory.id
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
                    this.form.status = this.supportCategory.status
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