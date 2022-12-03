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
                                <v-flex d-flex align-center v-for="(trainingOption, index) in form.training_options" :key="index">
                                    <v-autocomplete
                                       v-model="form.training_options[index].id"
                                       :items="trainingOptions"
                                       label="Training Options"
                                       item-text="name"
                                       item-value="id"
                                       outlined
                                       class="mr-md-3"
                                       :rules="[rules.training_option]"
                                    ></v-autocomplete>
                                    <v-text-field
                                       outlined
                                       v-model.number="form.training_options[index].value"
                                       label="Value"
                                       type="number"
                                       :rules="[rules.training_option_value]"
                                    ></v-text-field>
                                    <v-icon 
                                        color="red"
                                        class="mx-1 mb-7"
                                        @click="deleteTrainingOption(index)"
                                    >
                                        mdi-trash-can-outline
                                    </v-icon>
                                </v-flex>
                                <primary-button
                                    :disabled="hasAvailableTrainingOptions"
                                    text="Add Training Option"
                                    @submit="addTrainingOption()"
                                />
                                <br>
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
import {ID_RULE, NAME_RULE, VIDEO_DESCRIPTION_RULE, TRAINING_OPTION_VALUE_RULE} from '../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, COURSE_AREA_MESSAGE, VIDEO_MESSAGE, TRAINING_OPTION_MESSAGE, TRAINING_OPTION_VALUE_MESSAGE} from '../../helpers/Messages'
import { STATUSES_SELECTION } from '../../helpers/Status'
import { VueEditor } from "vue2-editor";
import PrimaryButton from '../Buttons/PrimaryButton.vue'

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
        PrimaryButton,
    },

    data() {
        return {
            form: {
                name:               '',
                description:        '',
                content:            '',
                course_area_id:     '',
                video_id:           '',
                status:             '',
                trainingOptions:    [],
            },
            course_id: '',
            loading: false,
            errors: null,
            rules: {
                name:                   v => NAME_RULE.test(v)                  || NAME_MESSAGE,
                content:                v => VIDEO_DESCRIPTION_RULE.test(v)     || DESCRIPTION_MESSAGE,
                course_area_id:         v => ID_RULE.test(v)                    || COURSE_AREA_MESSAGE,
                video_id:               v => ID_RULE.test(v)                    || VIDEO_MESSAGE,
                training_option:        v => ID_RULE.test(v)                    || TRAINING_OPTION_MESSAGE,
                training_option_value:  v => TRAINING_OPTION_VALUE_RULE.test(v) || TRAINING_OPTION_VALUE_MESSAGE,
            },
            statuses: STATUSES_SELECTION
        }
    },

    created(){
        this.form                   = {...this.lesson};
        this.course_id              = this.lesson.course_id;
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

        trainingOptions() {
            const data = this.$store.getters['TrainingOptionState/trainingOptions'];
            if(!data) {
                return [];
            }

            return data.filter(trainingOption => {
                const activeTrainingOptionsIds  = this.form.training_options.map(trainingOption => trainingOption.id);
                trainingOption.disabled         = activeTrainingOptionsIds.includes(trainingOption.id);
                return trainingOption;
            })
        },

        hasAvailableTrainingOptions() {
            return !Boolean(this.trainingOptions.filter(trainingOption => !trainingOption.disabled).length)
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


    methods: {
        submit() {
            this.errors = null;
            
            if(!this.$refs.form.validate() || this.errors) {
                return;
            }
            
            this.loading = true;
            
            this.$store.dispatch('LessonState/updateLesson', this.getTransformedPayload())
                .then(() => {
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
        },

        getTransformedPayload() {
            const payload       = {...this.form, course_id: this.course_id};
            
            payload.skills      = payload.skills.map(skill => {
                return typeof skill === 'object' ? skill.id : skill;
            }); 

            payload.terms       = payload.terms.map(term => {
                return typeof term === 'object' ? term.id : term;
            }); 

            payload.equipment   = payload.equipment.map(equipment => {
                return typeof equipment === 'object' ? equipment.id : equipment;
            }); 

            return payload;
        },

        addTrainingOption() {
            this.form.training_options.push({
                id: null,
                value: ''
            });
        },

        deleteTrainingOption(index) {
            this.form.training_options.splice(index, 1)
        },
    }
}
</script>

<style scoped>
</style>