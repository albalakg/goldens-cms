<template>
    <v-card class="pa-5">
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        User
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <router-link :to="`/users/show/${user.id}`">
                            {{user.full_name}}
                        </router-link>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Course
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <router-link :to="`/content/courses/show/${course.id}`">
                            {{course.name}}
                        </router-link>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Price
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{order.price}} NIS
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Created At
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{order.created_at}}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="order.finished_at">
                <v-list-item-content>
                    <v-list-item-title>
                        Finished At
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{order.finished_at}}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Status
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <StatusChip 
                            :customText="statuses"
                            :status="order.status"
                        />
                        <!-- <v-form>
                            <v-flex d-flex justify-space-between>
                                <v-flex xs11>
                                    <v-select
                                        outlined
                                        :items="statuses"
                                        item-text="text"
                                        item-value="value"
                                        v-model="form.status"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs1 class="ml-5 mr-3">
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
                        </v-form> -->
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>   
    </v-card>
</template>

<script>
import { ORDER_STATUSES } from '../../helpers/Status'
import SubmitButton from '../Buttons/SubmitButton.vue'
import StatusChip from './../Status/StatusChip.vue';

export default {
    components: {
        SubmitButton,
        StatusChip
    },

    props: {
        order: {
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
            statuses: ORDER_STATUSES
        }
    },

    computed: {
        user() {
            const users     = this.$store.getters['UserState/users'];
            return users.find(user => user.id === this.order.user_id);
        },

        course() {
            const courses   = this.$store.getters['CourseState/courses'];
            return courses.find(course => course.id === this.order.content_id);
        },

        canSubmit() {
            return this.form.status === this.order.status;
        }
    },

    created() {
        this.form.status    = this.order.status
        this.form.id        = this.order.id
    },

    methods: {
        submit() {
            this.loading = true;
            this.$store.dispatch('OrderState/updateOrderStatus', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Updated the Order's status successfully`
                    });
                }).catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the Order\'s status',
                        type: 'error',
                    });
                    this.form.status = this.order.status
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
}
</script>
