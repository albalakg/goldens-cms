<template>
    <v-container fluid class="courseArea_show_wrapper">
        
        <div v-if="editedCourseArea">
            <TopCard 
                :text="'Course Area ' + editedCourseArea.name"
            />

            <br>
            
            <v-tabs vertical class="courseArea_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :courseArea="editedCourseArea" :is="tab.component" />
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
import CourseAreaDetails from '../../../components/CourseArea/CourseAreaDetails.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        CourseAreaDetails,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'CourseAreaDetails', 
                },
            ],
            editedCourseArea: null,
        }
    },

    created() {
        return this.getCourseArea();
    },

    watch: {
        courseAreas() {
            this.getCourseArea();
        }
    },

    computed: {
        courseAreas() {
            return this.$store.getters['CourseAreaState/courseAreas'];
        }
    },

    methods: {
        async getCourseArea() {
            this.editedCourseArea = await this.$store.dispatch('CourseAreaState/getCourseArea', this.$route.params.courseAreaID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('CourseAreaState/createCourseArea', this.form)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `CourseArea ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/courseAreas')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the courseArea',
                        type: 'error',
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

    .courseArea_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>