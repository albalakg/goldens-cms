<template>
    <v-card class="pa-5">

        <v-flex mx-auto xs12 md6 lg4 d-flex justify-center>
            <v-form class="w100" @submit.prevent="submit()" ref="form">
                <v-textarea
                    outlined
                    v-model="form.comment"
                    counter
                    maxlength="5000"
                    label="Comment"
                    :rules="[rules.comment]"
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
                v-for="(comment, index) in comments"
                :key="index"
                :color="comment.created_by === test.user_course.user_id ? 'red' : 'blue'"
            >
                <span slot="opposite">
                    {{comment.human_time}}
                </span>
                <v-card class="elevation-2">
                    <v-card-title class="text-h5 pb-0">
                            {{comment.full_name}} 
                    </v-card-title>
                <v-card-text class="comment_text">
                    {{comment.comment}}                    
                </v-card-text>
                <div class="pl-4 pb-3 pr-5">
                    <small>
                        <v-flex d-flex justify-space-between>
                            <span>
                                {{comment.created_at}}
                            </span>
                            <router-link :to="`/users/show/${comment.created_by}`">
                                <strong :class="`${comment.created_by === test.user_course.user_id ? 'teal' : 'black'}--text`" :title="`Show ${comment.full_name}`">
                                    {{comment.created_by === test.user_course.user_id ? 'Customer' : 'Tester'}}
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
import TableCard from '../Cards/TableCard.vue'
import {COMMENT_RULE} from '../../helpers/Rules' 
import {COMMENT_MESSAGE} from '../../helpers/Messages' 
import SubmitButton from '../Buttons/SubmitButton.vue'

export default {
    components: {
        TableCard,
        SubmitButton,
    },

    data() {
        return {
            form: {
                comment: ''
            },
            rules: {
                comment: v => COMMENT_RULE.test(v) || COMMENT_MESSAGE,
            },
            loading: false
        }
    },
    
    props: {
        test: {
            type: Object,
            required: true
        }
    },

    computed: {
        comments() {
            const users = this.$store.getters['UserState/users'];

            const comments = this.test.comments.map(comment => {
                const user = users.find(user => user.id === comment.created_by);
                comment.full_name = user ? user.full_name : 'Unknown';
                
                return comment;
            });

            return comments;
        }
    },

    created() {
        this.form.user_course_submission_id = this.test.id;
    },

    methods: {
        submit() {
            this.errors = null;
            
            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            this.$store.dispatch('TestState/createComment', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Comment created successfully`
                    });
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the comment',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                    this.form.comment = '';
                    this.$refs.form.reset()
                });
        }
    }
}
</script>

<style scoped>

</style>