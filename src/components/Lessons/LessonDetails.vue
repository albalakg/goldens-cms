<template>
    <v-container fluid>
        <v-form @submit.prevent="submit()" ref="form">
            <v-flex d-flex>
                <v-flex xs12 lg6 class="pr-5">
                    <FormCard
                        title="Details"
                    >
                        <template slot="content">
                            <div class="px-4">
                                <v-text-field
                                    outlined
                                    v-model="form.name"
                                    counter
                                    maxlength="40"
                                    label="Name"
                                    :rules="[rules.name]"
                                ></v-text-field>
                                <VueEditor 
                                    v-model="form.content"
                                    class="text_editor"
                                />
                                <v-autocomplete
                                    outlined
                                    :loading="!videos.length"
                                    :items="videos"
                                    item-text="name"
                                    item-value="id"
                                    v-model="form.video_id"
                                    label="Video"
                                    :rules="[rules.video_id]"
                                ></v-autocomplete>
                                <v-select
                                    outlined
                                    :items="statuses"
                                    item-text="text"
                                    item-value="value"
                                    v-model="form.status"
                                    label="Status"
                                ></v-select>
                            </div>
                        </template>
                    </FormCard>
                </v-flex>
                <v-flex xs12 lg6 class="pl-5">
                    <FormCard
                        title="Course"
                    >
                        <template slot="content">
                            <div class="px-4">
                                <v-autocomplete
                                    outlined
                                    :loading="!courses.length"
                                    :items="courses"
                                    item-text="name"
                                    item-value="id"
                                    v-model="course_id"
                                    label="Course"
                                ></v-autocomplete>
                                <v-autocomplete
                                    outlined
                                    :items="courseAreas"
                                    item-text="name"
                                    item-value="id"
                                    v-model="form.course_area_id"
                                    label="Course Area"
                                    :rules="[rules.course_area_id]"
                                ></v-autocomplete>
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
import FormCard from '../../components/Cards/FormCard.vue'
import TopCard from '../../components/Cards/TopCard.vue'
import SubmitButton from '../../components/Buttons/SubmitButton.vue'
import CancelButton from '../../components/Buttons/CancelButton.vue'
import {ID_RULE, VIDEO_NAME_RULE, VIDEO_DESCRIPTION_RULE} from '../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, COURSE_AREA_MESSAGE, VIDEO_MESSAGE} from '../../helpers/Messages'
import { STATUSES_SELECTION } from '../../helpers/Status'
import { VueEditor } from "vue2-editor";

export default {
    props: {
        lesson: {
            type: Object,
            required: true
        }
    },

    components: {
        FormCard,
        TopCard,
        SubmitButton,
        CancelButton,
        VueEditor,
    },

    data() {
        return {
            form: {
                name:           '',
                content:        '',
                course_area_id: '',
                video_id:       '',
                status:         '',
            },
            course_id: '',
            loading: false,
            errors: null,
            rules: {
                name:           v => VIDEO_NAME_RULE.test(v)        || NAME_MESSAGE,
                content:        v => VIDEO_DESCRIPTION_RULE.test(v) || DESCRIPTION_MESSAGE,
                course_area_id: v => ID_RULE.test(v)                || COURSE_AREA_MESSAGE,
                video_id:       v => ID_RULE.test(v)                || VIDEO_MESSAGE,
            },
            statuses: STATUSES_SELECTION
        }
    },

    created(){
        console.log('this.les', this.lesson);
        this.form = {...this.lesson};
        this.course_id = this.lesson.course_id;
    },

    computed: {
        courseAreas() {
            let data = {...this.$store.getters['CourseAreaState/courseAreas']};

            if(this.course_id && data && data.data) {
                data.data = data.data.filter(item => item.course_id === this.course_id);
            }

            return data ? data.data : [];
        },

        courses() {
            const data = this.$store.getters['CourseState/courses'];
            return data ? data.data : [];
        },

        videos() {
            const data = this.$store.getters['VideoState/videos'];
            return data ? data.data : [];
        },
    },

    watch: {
       
    },

    methods: {
        submit() {
            this.errors = null;
            
            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            this.$store.dispatch('LessonState/updateLesson', {...this.form, course_id: this.course_id})
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Lesson ${this.form.name} updated successfully`
                    });
                    this.$router.push('/content/lessons')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the lesson',
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
</style>