<template>
    <v-card class="pa-5">
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        User
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{user.full_name}}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Course
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{course.name}}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Video
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <video controls :src="test.video"></video>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Comment
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{test.comment}}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Created At
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{test.created_at}}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="test.finished_at">
                <v-list-item-content>
                    <v-list-item-title>
                        Finished At
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{test.finished_at}}
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
import { STATUSES_SELECTION } from './../../helpers/Status'
import SubmitButton from '../../components/Buttons/SubmitButton.vue'

export default {
    components: {
        SubmitButton
    },

    props: {
        test: {
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
            statuses: STATUSES_SELECTION
        }
    },

    computed: {
        user() {
            const users     = this.$store.getters['UserState/users'];
            return users.data.find(user => user.id === this.test.user_course.user_id);
        },

        course() {
            const courses   = this.$store.getters['CourseState/courses'];
            return courses.data.find(course => course.id === this.test.user_course.course_id);
        },
    },

    created() {
        this.form.status    = this.test.status
        this.form.id        = this.test.id
    },

    methods: {
        submit() {
            this.loading = true;
            this.$store.dispatch('TestState/updateStatus', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Updated the Test's status successfully`
                    });
                }).catch(err => {
                    console.log('12312');
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the Test\'s status',
                        type: 'error',
                    });
                    this.form.status = this.test.status
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