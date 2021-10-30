<template>
    <v-card class="pa-5">
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Code
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{coupon.code}}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Value
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{coupon.coupon_value}}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Created At
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{coupon.created_at}}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Created By
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <router-link :to="`/users/show/${user.id}`">
                            {{user.fullName}}
                        </router-link>
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
import { STATUSES_SELECTION } from './../../helpers/Status'
import SubmitButton from '../../components/Buttons/SubmitButton.vue'

export default {
    components: {
        SubmitButton
    },

    props: {
        coupon: {
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
            return users.find(user => user.id === this.coupon.created_by);
        },

        canSubmit() {
            return this.form.status === this.coupon.status;
        }
    },

    created() {
        this.form.status    = this.coupon.status
        this.form.id        = this.coupon.id
    },

    methods: {
        submit() {
            this.loading = true;
            this.$store.dispatch('CouponState/updateCouponStatus', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Updated the Coupon's status successfully`
                    });
                }).catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the Coupon\'s status',
                        type: 'error',
                    });
                    this.form.status = this.coupon.status
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