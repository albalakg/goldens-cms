<template>
    <v-container fluid>
        <TopCard 
            text="Add Course to User"
        />
        
        <br>

        <v-form @submit.prevent="submit()" ref="form">
            <v-flex d-flex>
                <v-flex xs12 lg6 class="pr-5">
                    <FormCard
                        title="Choose Course and User"
                    >
                        <template slot="content">
                            <div class="px-4">
                                <v-autocomplete
                                    outlined
                                    :items="courses"
                                    :loading="!courses.length"
                                    item-text="name"
                                    item-value="id"
                                    v-model="form.course_id"
                                    label="Course"
                                    :rules="[rules.course_id]"
                                ></v-autocomplete>
                                <v-autocomplete
                                    outlined
                                    :items="users"
                                    :loading="!users.length"
                                    item-text="full_name"
                                    item-value="id"
                                    v-model="form.user_id"
                                    label="User"
                                    :rules="[rules.user_id]"
                                ></v-autocomplete>
                            </div>
                        </template>
                    </FormCard>
                </v-flex>
                <v-flex xs12 lg6 class="pl-5">
                    <FormCard
                        title="Details"
                    >
                        <template slot="content">
                            <div class="px-4">
                                <v-text-field
                                    outlined
                                    v-model="form.price"
                                    label="Price"
                                    autocomplete="off"
                                    class="pr-3"
                                    :rules="[rules.price]"
                                ></v-text-field>
                                <v-menu
                                    ref="menu"
                                    v-model="form.end_at"
                                    :close-on-content-click="false"
                                    :return-value.sync="date"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        outlined
                                        v-model="date"
                                        :rules="[rules.end_at]"
                                        label="Expiration Date"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="date"
                                        no-title
                                        :min="minDate"
                                        scrollable
                                    >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="menu = false"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="$refs.menu.save(date)"
                                    >
                                        OK
                                    </v-btn>
                                    </v-date-picker>
                                </v-menu>
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
import {PHONE_RULE, ID_RULE, PRICE_RULE} from './../../../helpers/Rules' 
import {PHONE_MESSAGE, COURSE_MESSAGE, USER_MESSAGE, EXPIRATION_MESSAGE, PRICE_MESSAGE} from './../../../helpers/Messages' 

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
                course_id:  '',
                user_id:    '',
                price:      '',
                end_at:     '',
            },
            pickedCourse: null,
            date: '',
            menu: false,
            loading: false,
            errors: null,
            rules: {
                course_id:  v =>    ID_RULE.test(v)         || COURSE_MESSAGE,
                user_id:    v =>    ID_RULE.test(v)         || USER_MESSAGE,
                end_at:     v =>    !!v                     || EXPIRATION_MESSAGE,
                price:      v =>    PRICE_RULE.test(v)      || PRICE_MESSAGE,
            }
        }
    },

    created() {
        this.setChosenData();
    },

    watch: {
        'form.course_id': {
            deep: true,
            handler() {
                this.getPickedCourse()
            }
        }
    },

    computed: {
        courses() {
            const courses = this.$store.getters['CourseState/courses'];
            return courses ? courses.data : [];
        },
        
        users() {
            const users = this.$store.getters['UserState/users'];
            return users ? users.data : [];
        },

        async course() {
            this.pickedCourse = await this.$store.dispatch('CourseState/getCourse', this.course_id);
        },

        minDate() {
            const date = new Date()
            return date.toISOString().substr(0, 10);
        }
    },

    methods: {
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