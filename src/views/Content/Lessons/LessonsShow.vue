<template>
    <v-container fluid class="lesson_show_wrapper">
        
        <div v-if="editedLesson">
            <TopCard 
                :text="'Lesson ' + editedLesson.name"
            />

            <br>
            
            <v-tabs vertical class="lesson_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :lesson="editedLesson" :is="tab.component" />
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
import LessonDetails from '../../../components/Lessons/LessonDetails.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        LessonDetails,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'LessonDetails', 
                },
            ],
            editedLesson: null,
        }
    },

    created() {
        return this.getLesson();
    },

    watch: {
        lessons() {
            this.getLesson();
        }
    },

    computed: {
        lessons() {
            return this.$store.getters['LessonState/lessons'];
        }
    },

    methods: {
        async getLesson() {
            this.editedLesson = await this.$store.dispatch('LessonState/getLesson', this.$route.params.lessonID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('LessonState/createLesson', this.form)
                .then(res => {
                    console.log('res', res);
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Lesson ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/lessons')
                })
                .catch(err => {
                    console.log('err', err);
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the lesson',
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

    .lesson_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>