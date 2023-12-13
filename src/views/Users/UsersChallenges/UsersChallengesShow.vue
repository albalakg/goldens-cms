<template>
    <v-container fluid>
        <TopCard 
            text="User Challenge Attempt"
        />
        
        <br>

        <v-form @submit.prevent="submit()" ref="form">
            <v-flex d-flex>
                <v-flex xs12 lg6 class="pr-5">
                    <FormCard
                        title="Details"
                    >
                        <template slot="content">
                            <div class="px-4">
                                {{ userChallenge }}
                            </div>
                        </template>
                    </FormCard>
                </v-flex>
                <v-flex xs12 lg6 class="pr-5">
                    <FormCard
                    >
                        <template slot="content">
                            <div class="px-4">
                                1
                            </div>
                        </template>
                    </FormCard>
                </v-flex>
            </v-flex>
            <v-flex d-flex justify-space-between class="mt-10">
                <v-flex md12 lg6 class="pr-5">
                    <CancelButton 
                        goBack
                    />
                </v-flex>
                <v-flex md12 lg6 class="pl-5">
                    <SubmitButton
                        :loading="loading"
                        @submit="submit()"
                    />
                </v-flex>
            </v-flex>
        </v-form>

    </v-container>
</template>

<script>
import FormCard from './../../../components/Cards/FormCard.vue'
import TopCard from './../../../components/Cards/TopCard.vue'
import SubmitButton from './../../../components/Buttons/SubmitButton.vue'
import CancelButton from './../../../components/Buttons/CancelButton.vue'
import {ID_RULE, PRICE_RULE} from './../../../helpers/Rules' 
import {COURSE_MESSAGE, USER_MESSAGE, EXPIRATION_MESSAGE, PRICE_MESSAGE} from './../../../helpers/Messages' 

export default {
    components: {
        FormCard,
        TopCard,
        SubmitButton,
        CancelButton,
    },

    data() {
        return {
            form: {
                course_id:  0,
                user_id:    '',
                price:      '',
                end_at:     '',
            },
            loading: false,
            rules: {
                course_id:  v =>    ID_RULE.test(v)         || COURSE_MESSAGE,
                user_id:    v =>    ID_RULE.test(v)         || USER_MESSAGE,
                end_at:     v =>    !!v                     || EXPIRATION_MESSAGE,
                price:      v =>    PRICE_RULE.test(v)      || PRICE_MESSAGE,
            }
        }
    },

    created() {

    },

    computed: {
        userChallenge() {
            console.log(this.$route.params.challengeId);
            const challenges    = this.$store.getters['ChallengeState/challenges'];
            const challenge      = challenges.find(challenge => challenge.id == this.$route.params.challengeId);
            if(!challenge) {
                return null;
            }
            return this.$route.params.challengeId;
        }
    },

    methods: {
        setDefaultExpirationDate() {
            const now           = new Date();
            const year          = now.getFullYear();
            const month         = now.getMonth();
            const day           = now.getDate();
            const defaultDate   = new Date(year + 1, month, day + 1)
            
            this.date = defaultDate.toISOString().substr(0, 10);
        },

        setChosenData() {
            this.form.course_id = +this.$route.query.course_id;
            this.form.user_id = +this.$route.query.user_id;
        },

        async getPickedCourse() {
            this.pickedCourse = await this.$store.dispatch('CourseState/getCourse', this.form.course_id);
            if(this.pickedCourse) {
                this.form.price     = this.pickedCourse.price;
                this.form.end_at    = this.pickedCourse.end_at;
            }
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('UserCourseState/addCourseToUser', {...this.form, end_at: this.date})
                .finally(() => {
                    this.goToPage();
                    this.loading = false;
                });
        },

        goToPage() {
            if(this.$route.query.user_id) {
                return this.$router.push('/users/show/' + this.$route.query.user_id)
            } 

            if(this.$route.query.course_id) {
                return this.$router.push('/content/courses/show/' + this.$route.query.course_id)
            } 
        }
    }
}
</script>

<style scoped>
</style>