<template>
    <v-container fluid class="course_show_wrapper">
        
        <div v-if="editedCourse">
            <TopCard 
                :text="'Course ' + editedCourse.full_name"
            />

            <br>
            
            <v-tabs vertical class="course_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :course="editedCourse" :is="tab.component" />
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
// import CourseDetails from '../../../components/Courses/CourseDetails.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        // CourseDetails,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'CourseDetails', 
                },
            ],
            editedCourse: null,
        }
    },

    created() {
        return this.getCourse();
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
                    console.log('res', res);
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Course ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/courses')
                })
                .catch(err => {
                    console.log('err', err);
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the course',
                        type: 'error',
                        time: 2000
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
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