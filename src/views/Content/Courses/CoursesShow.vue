<template>
    <v-container fluid class="course_show_wrapper">
        
        <div v-if="editedCourse">
            <TopCard 
                :text="'Course ' + editedCourse.name"
            />

            <br>

            <v-tabs vertical class="course_show_card" v-model="currentTab">
                <template v-for="(tab, index) in tabs">
                    <v-tab :value="index" :key="index" @click="setTab(index)">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :course="editedCourse" :is="tab.component" :content="currentContent" />
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
import CourseDetails from '../../../components/Courses/CourseDetails.vue'
import CourseUsers from '../../../components/Courses/CourseUsers.vue'
import OrderCourseContent from '../../../components/Courses/OrderCourseContent.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        CourseDetails,
        CourseUsers,
        OrderCourseContent
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'CourseDetails', 
                },
                { 
                    text: 'Users', 
                    component: 'CourseUsers', 
                },
                { 
                    text: 'Order', 
                    component: 'OrderCourseContent', 
                },
            ],
            currentTab: 0,
            editedCourse: null,
        }
    },

    created() {
        this.getCourse();
        this.goToTab()
    },

    watch: {
        courses() {
            this.getCourse();
        }
    },

    computed: {
        courses() {
            return this.$store.getters['CourseState/courses'];
        }
    },

    methods: {
        goToTab() {
            this.currentTab = Number(this.$route.query.tab);
        },

        async getCourse() {
            this.editedCourse = await this.$store.dispatch('CourseState/getCourse', this.$route.params.courseID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('CourseState/createCourse', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Course ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/courses')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the course',
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
        }
    }
}
</script>

<style scoped>

    .course_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>