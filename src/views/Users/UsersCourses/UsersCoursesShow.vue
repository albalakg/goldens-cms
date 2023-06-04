<template>
    <v-container fluid class="user_show_wrapper">
        
        <div v-if="isReady">
            <TopCard 
                :text="'User\'s ' + user.full_name + ' Course'"
            />

            <br>
            
            <v-tabs vertical class="user_show_card" v-model="currentTab">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index" @click="setTab(index)">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component 
                                :userCourse="userCourse" 
                                :user="user" 
                                :course="course" 
                                :is="tab.component" 
                            />
                        </div>
                    </v-tab-item>
                </template>
            </v-tabs>
        </div>


        <FormLoader v-else />

    </v-container>
</template>

<script>
import FormLoader from '../../../components/Loaders/FormLoader.vue'
import TopCard from '../../../components/Cards/TopCard.vue'
import UserCourseDetails from './../../../components/UserCourse/UserCourseDetails.vue'
import UserCourseProgress from './../../../components/UserCourse/UserCourseProgress.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        UserCourseDetails,
        UserCourseProgress,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'UserCourseDetails', 
                },
                { 
                    text: 'Progress', 
                    component: 'UserCourseProgress', 
                },
            ],
            currentTab: 0,
            userCourse: null,
            user: null,
            course: null,
        }
    },

    created() {
        this.goToTab()
        this.getUserCourse();
    },

    watch: {
        users_courses() {
            this.getUserCourse();
        }
    },

    computed: {
        users_courses() {
            return this.$store.getters['UserCourseState/users_courses'];
        },

        isReady() {
            return this.user && this.userCourse && this.course;
        }
    },

    methods: {
        async getUserCourse() {
            this.userCourse = await this.$store.dispatch('UserCourseState/getById', this.$route.params.userCourseID);
            this.user       = await this.$store.dispatch('UserState/getUser', this.userCourse.user_id);
            this.course     = await this.$store.dispatch('CourseState/getCourse', this.userCourse.course_id);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('UserState/createUser', this.form)
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `User ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/users')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the user',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        setTab(index) {
            this.$router.push(
                {
                    path: this.$route.path,
                    query: { 
                        tab: index
                    }
                }
            )
        },
        
        goToTab() {
            this.currentTab = Number(this.$route.query.tab);
        },
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