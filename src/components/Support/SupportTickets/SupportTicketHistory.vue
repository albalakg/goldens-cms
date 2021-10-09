<template>
    <v-card class="pa-5">

        <v-flex mx-auto xs12 md6 lg4 d-flex justify-center>
            <v-form class="w100" @submit.prevent="submit()" ref="form">
                <v-textarea
                    outlined
                    v-model="form.message"
                    counter
                    maxlength="5000"
                    label="Comment"
                    :rules="[rules.message]"
                ></v-textarea>
                <SubmitButton
                    :loading="loading"
                    @submit="submit()"
                />
            </v-form>
        </v-flex>

        <br>

        <v-timeline
            :dense="$vuetify.breakpoint.smAndDown"
        >
            <v-timeline-item
                v-for="(message, index) in messages"
                :key="index"
                :color="message.created_by === supportTicket.user_id ? 'red' : 'blue'"
            >
                <span slot="opposite">
                    {{message.human_time}}
                </span>
                <v-card class="elevation-2">
                    <v-card-title class="text-h5 pb-0">
                        {{message.full_name}} 
                    </v-card-title>
                <v-card-text class="message_text">
                    {{message.message}}                    
                </v-card-text>
                <div class="pl-4 pb-3 pr-5">
                    <small>
                        <v-flex d-flex justify-space-between>
                            <span>
                                {{message.created_at}}
                            </span>
                            <router-link :to="`/users/show/${message.created_by}`">
                                <strong :class="`${message.created_by === supportTicket.created_by ? 'teal' : 'black'}--text`" :title="`Show ${message.full_name}`">
                                    {{message.created_by === supportTicket.user_id ? 'Customer' : 'Support'}}
                                </strong>
                            </router-link>
                        </v-flex>
                    </small>
                </div>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </v-card>
</template>

<script>
import TableCard from '../../Cards/TableCard.vue'
import {COMMENT_RULE} from '../../../helpers/Rules' 
import {COMMENT_MESSAGE} from '../../../helpers/Messages' 
import SubmitButton from '../../Buttons/SubmitButton.vue'

export default {
    components: {
        TableCard,
        SubmitButton,
    },

    data() {
        return {
            form: {
                message: ''
            },
            rules: {
                message: v => COMMENT_RULE.test(v) || COMMENT_MESSAGE,
            },
            loading: false
        }
    },
    
    props: {
        supportTicket: {
            type: Object,
            required: true
        }
    },

    computed: {
        messages() {
            const users = this.$store.getters['UserState/users'];
            if(!users) {
                return [];
            }

            const messages = this.supportTicket.messages.map(message => {
                const user = users.find(user => user.id === message.created_by);
                message.full_name = user ? user.full_name : 'Unknown';
                
                return message;
            });

            return messages;
        }
    },

    created() {
        this.form.support_ticket_id = this.supportTicket.id;
    },

    methods: {
        submit() {
            this.errors = null;
            
            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            this.$store.dispatch('SupportState/createSupportTicketMessage', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Message created successfully`
                    });
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the message',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                    this.form.message = '';
                    this.$refs.form.reset()
                });
        }
    }
}
</script>

<style scoped>

</style>