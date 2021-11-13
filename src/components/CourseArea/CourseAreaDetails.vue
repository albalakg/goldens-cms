<template>
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
                                label="Name"
                                counter
                                maxlength="30"
                                :rules="[rules.name]"
                            ></v-text-field>
                            <v-textarea
                                outlined
                                v-model="form.description"
                                counter
                                maxlength="1000"
                                label="Description"
                                :rules="[rules.description]"
                            ></v-textarea>
                            <v-autocomplete
                                outlined
                                :items="courses"
                                item-text="name"
                                item-value="id"
                                v-model="form.course_id"
                                label="Course"
                                :rules="[rules.course_id]"
                            ></v-autocomplete>
                            <v-combobox
                                outlined
                                item-value="id"
                                item-text="name"
                                :items="lessons"
                                label="Lessons"
                                multiple
                                v-model="form.lessons"
                            ></v-combobox>
                            <v-select
                                outlined
                                :items="statuses"
                                item-text="text"
                                item-value="value"
                                v-model="form.status"
                                label="Status"
                                counter
                            ></v-select>
                        </div>
                    </template>
                </FormCard>
            </v-flex>
            <v-flex xs12 lg6 class="pl-5">
                <FormCard
                    title="Files"
                >
                    <template slot="content">
                        <div class="px-4">
                            <v-file-input
                                outlined
                                show-size
                                v-model="image"
                                label="Image"
                                prepend-icon=""
                                :error-messages="errors && errors.image ? errors.image : ''"
                            ></v-file-input>
                            <img class="preview_image" :src="imageSrc" alt="">
                            <v-file-input
                                outlined
                                show-size
                                v-model="trailer"
                                accept="mp4"
                                label="Trailer"
                                prepend-icon=""
                                :error-messages="errors && errors.trailer ? errors.trailer : ''"
                            ></v-file-input>
                            <video controls class="preview_image" :src="trailerSrc"></video>
                        </div>
                    </template>
                </FormCard>
            </v-flex>
        </v-flex>
        <v-flex d-flex justify-space-between class="mt-10 mb-2">
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
</template>

<script>
import FormCard from '../Cards/FormCard.vue'
import TopCard from '../Cards/TopCard.vue'
import SubmitButton from '../Buttons/SubmitButton.vue'
import CancelButton from '../Buttons/CancelButton.vue'
import { STATUSES_SELECTION } from '../../helpers/Status'
import {NAME_RULE, DESCRIPTION_RULE, ID_RULE, TRAILER_FILE_SIZE_RULE, VIDEO_FILE_TYPES_RULE, IMAGE_FILE_TYPES_RULE, IMAGE_FILE_SIZE_RULE} from '../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, COURSE_MESSAGE, TRAILER_FILE_SIZE_MESSAGE, TRAILER_FILE_TYPES_MESSAGE, IMAGE_FILE_TYPES_MESSAGE, IMAGE_FILE_SIZE_MESSAGE} from '../../helpers/Messages' 

export default {
    components: {
        FormCard,
        TopCard,
        SubmitButton,
        CancelButton,
    },

    props: {
        courseArea: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            form: {
                name:           '',
                description:    '',
                course_id:      '',
                status:         '',
                lessons:        [],
            },
            image: null,
            trailer: null,
            loading: false,
            errors: null,
            rules: {
                name:           v => NAME_RULE.test(v)           || NAME_MESSAGE,
                description:    v => DESCRIPTION_RULE.test(v)    || DESCRIPTION_MESSAGE,
                course_id:      v => ID_RULE.test(v)             || COURSE_MESSAGE,
            },
            statuses: STATUSES_SELECTION
        }
    },

    created() {
        this.setData();
    },

    computed: {
        courses() {
            const courses = this.$store.getters['CourseState/courses'];
            return courses ? courses : [];
        },

        lessons() {
            const lessons = this.$store.getters['LessonState/lessons'];
            if(!lessons) {
                return [];
            }
            
            if(this.courseArea) {
                this.form.lessons = lessons.filter(lesson => lesson.course_area_id === this.form.id);
            }

            return lessons.filter(lesson => !lesson.course_area_id || lesson.course_area_id === this.form.id);
        },

        imageSrc() {
            return this.image ? URL.createObjectURL(this.image) : 
                    this.courseArea.imageSrc ? this.courseArea.imageSrc : null;
        },

        trailerSrc() {
            return this.trailer ? URL.createObjectURL(this.trailer) : 
                    this.courseArea.trailerSrc ? this.courseArea.trailerSrc : null;
        },
    },

    watch: {
        trailer() {
            this.validateTrailer();
        },

        image() {
            this.validateImage();
        },
    },

    methods: {
        setData() {
            this.$store.dispatch('CourseState/getCourses');
            this.form = {...this.courseArea};
            
            if(typeof this.form.trailer === 'object') {
                this.trailer = this.form.trailer;
            }

            if(typeof this.form.image === 'object') {
                this.image = this.form.image;
            }
        },

        submit() {
            this.errors = null;
            
            this.validateTrailer();
            this.validateImage();

            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            
            const course = this.courses.find(course => course.id === this.form.course_id);
            if(course) {
                this.form.course_name = course.name;
            }

            const data_to_send = {
                ...this.form,
                image: this.image,
                trailer: this.trailer
            }

            data_to_send.lessons            = this.form.lessons.map(lesson => lesson.id);
            data_to_send.deleted_lessons    = this.getDeletedLessons();
            data_to_send.lessons_count      = this.form.lessons.length;
            
            this.$store.dispatch('CourseAreaState/updateCourseArea', data_to_send)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Course Area ${this.form.name} updated successfully`
                    });

                    this.$store.dispatch('LessonState/assignLessons', {lessons: data_to_send.lessons, courseArea: this.courseArea});
                    this.$store.dispatch('LessonState/unassignLessons', data_to_send.deleted_lessons);

                    this.$router.push('/content/course-areas');
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the Course Area',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        validateTrailer() {
            if(this.errors) {
                this.errors.trailer = null;
            }

            if(!this.trailer) {
                return;
            }

            if(!VIDEO_FILE_TYPES_RULE.includes(this.trailer.type)) {
                return this.errors ? this.errors.trailer = TRAILER_FILE_TYPES_MESSAGE : this.errors = {
                    trailer: TRAILER_FILE_TYPES_MESSAGE
                };
            }

            if(this.trailer.size > TRAILER_FILE_SIZE_RULE) {
                return this.errors ? this.errors.trailer = TRAILER_FILE_SIZE_MESSAGE : this.errors = {
                    trailer: TRAILER_FILE_SIZE_MESSAGE
                };
            }
        },

        validateImage() {
            if(this.errors) {
                this.errors.image = null;
            }

            if(!this.image) {
                return;
            }

            if(!IMAGE_FILE_TYPES_RULE.includes(this.image.type)) {
                return this.errors ? this.errors.image = IMAGE_FILE_TYPES_MESSAGE : this.errors = {
                    image: IMAGE_FILE_TYPES_MESSAGE
                };
            }

            if(this.image.size > IMAGE_FILE_SIZE_RULE) {
                return this.errors ? this.errors.image = IMAGE_FILE_SIZE_MESSAGE : this.errors = {
                    image: IMAGE_FILE_SIZE_MESSAGE
                };
            }
        },

        getDeletedLessons() {
            const init_lessons = this.lessons.map(lesson => {
                if(lesson.course_area_id === this.form.id) {
                    return lesson.id
                }
            });

            const lessons_ids = this.form.lessons.map(lesson => lesson.id);

            return init_lessons.filter(lesson => {
                if(!lessons_ids.includes(lesson)) {
                    return lesson
                }
            })
        }
    }
}
</script>
