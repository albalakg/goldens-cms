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
                                    v-model="form.description"
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
                                <v-autocomplete
                                    v-model="form.skills"
                                    :items="skills"
                                    label="Skills"
                                    item-text="name"
                                    item-value="id"
                                    multiple
                                    outlined
                                ></v-autocomplete>
                                <v-autocomplete
                                    v-model="form.terms"
                                    :items="terms"
                                    label="Terms"
                                    item-text="name"
                                    item-value="id"
                                    multiple
                                    outlined
                                ></v-autocomplete>
                                <v-autocomplete
                                    v-model="form.equipment"
                                    :items="equipment"
                                    label="Equipment"
                                    item-text="name"
                                    item-value="id"
                                    multiple
                                    outlined
                                ></v-autocomplete>
                            </div>
                        </template>
                    </FormCard>
                </v-flex>
            </v-flex>
            
            <br>

            <v-flex xs12>
                <FormCard
                    title="Content"
                >
                    <template slot="content">
                        <VueEditor 
                            v-model="form.content"
                            placeholder="Content"
                            class="text_editor"
                        />

                        <v-flex d-flex>
                            <v-text-field
                                class="mr-3"
                                outlined
                                v-model="form.rehearsals"
                                label="Rehearsals"
                                :rules="[rules.rehearsals]"
                                hint="The amount of rehearsals"
                                persistent-hint
                            ></v-text-field>

                            <v-text-field
                                class="ml-3"
                                outlined
                                v-model="form.activity_time"
                                label="Activity Time"
                                :rules="[rules.activity_time]"
                                hint="The activity time in seconds"
                                persistent-hint
                            ></v-text-field>
                        </v-flex>

                        <v-flex d-flex>
                            <v-text-field
                                class="mr-3"
                                outlined
                                v-model="form.activity_period"
                                label="Activity Period"
                                :rules="[rules.activity_period]"
                                hint="The activity period in hours"
                                persistent-hint
                            ></v-text-field>

                            <v-text-field
                                class="ml-3"
                                outlined
                                v-model="form.rest_time"
                                label="Rest Time"
                                :rules="[rules.rest_time]"
                                hint="The rest time in minutes"
                                persistent-hint
                            ></v-text-field>
                        </v-flex>
                    </template>
                </FormCard>
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
import SubmitButton from '../../components/Buttons/SubmitButton.vue'
import CancelButton from '../../components/Buttons/CancelButton.vue'
import {ID_RULE, NAME_RULE, VIDEO_DESCRIPTION_RULE} from '../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, COURSE_AREA_MESSAGE, VIDEO_MESSAGE, REHEARSAL_MESSAGE, ACTIVITY_TIME_MESSAGE, ACTIVITY_PERIOD_MESSAGE, REST_TIME_MESSAGE} from '../../helpers/Messages'
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
        SubmitButton,
        CancelButton,
        VueEditor,
    },

    data() {
        return {
            form: {
                name:               '',
                description:        '',
                rehearsals:         '',
                activity_time:      '',
                activity_period:    '',
                rest_time:          '',
                content:            '',
                course_area_id:     '',
                video_id:           '',
                status:             '',
            },
            course_id: '',
            loading: false,
            errors: null,
            rules: {
                name:               v => NAME_RULE.test(v)              || NAME_MESSAGE,
                content:            v => VIDEO_DESCRIPTION_RULE.test(v) || DESCRIPTION_MESSAGE,
                course_area_id:     v => ID_RULE.test(v)                || COURSE_AREA_MESSAGE,
                video_id:           v => ID_RULE.test(v)                || VIDEO_MESSAGE,
                rehearsals:         v => ID_RULE.test(v)                || REHEARSAL_MESSAGE,
                activity_time:      v => ID_RULE.test(v)                || ACTIVITY_TIME_MESSAGE,
                activity_period:    v => ID_RULE.test(v)                || ACTIVITY_PERIOD_MESSAGE,
                rest_time:          v => ID_RULE.test(v)                || REST_TIME_MESSAGE,
            },
            statuses: STATUSES_SELECTION
        }
    },

    created(){
        this.form = {...this.lesson};
        this.course_id = this.lesson.course_id;
    },

    computed: {
        courseAreas() {
            let data = this.$store.getters['CourseAreaState/courseAreas'];

            if(this.course_id && data) {
                data = data.filter(item => item.course_id === this.course_id);
            }

            return data ? data : [];
        },

        courses() {
            const data = this.$store.getters['CourseState/courses'];
            return data ? data : [];
        },

        videos() {
            const data = this.$store.getters['VideoState/videos'];
            return data ? data : [];
        },

        skills() {
            const data = this.$store.getters['SkillState/skills'];
            return data ? data : [];
        },

        terms() {
            const data = this.$store.getters['TermState/terms'];
            return data ? data : [];
        },

        equipment() {
            const data = this.$store.getters['EquipmentState/equipment'];
            return data ? data : [];
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