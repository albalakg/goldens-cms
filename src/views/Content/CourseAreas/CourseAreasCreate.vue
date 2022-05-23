<template>
    <v-container fluid>
        <TopCard 
            text="Create Course Area"
        />
        
        <br>

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
            <br>
            <v-flex>
                <FormCard
                        title="Content"
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
                                    item-value="id"
                                    item-text="name"
                                    :items="trainers"
                                    label="Trainers"
                                    v-model="form.trainer_id"
                                />
                            </div>
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
import FormCard from '../../../components/Cards/FormCard.vue'
import TopCard from '../../../components/Cards/TopCard.vue'
import SubmitButton from '../../../components/Buttons/SubmitButton.vue'
import CancelButton from '../../../components/Buttons/CancelButton.vue'
import {NAME_RULE, DESCRIPTION_RULE, ID_RULE, TRAILER_FILE_SIZE_RULE, VIDEO_FILE_TYPES_RULE, IMAGE_FILE_TYPES_RULE, IMAGE_FILE_SIZE_RULE} from '../../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, COURSE_MESSAGE, TRAINER_MESSAGE, TRAILER_FILE_SIZE_MESSAGE, TRAILER_FILE_TYPES_MESSAGE, IMAGE_FILE_TYPES_MESSAGE, IMAGE_FILE_SIZE_MESSAGE, IMAGE_MESSAGE, TRAILER_MESSAGE} from '../../../helpers/Messages' 

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
                name:           '',
                description:    '',
                course_id:      '',
                trainer_id:     '',
                lessons:        []
            },
            image: null,
            trailer: null,
            loading: false,
            errors: null,
            rules: {
                name:           v => NAME_RULE.test(v)           || NAME_MESSAGE,
                description:    v => DESCRIPTION_RULE.test(v)    || DESCRIPTION_MESSAGE,
                trainer_id:     v => ID_RULE.test(v)             || TRAINER_MESSAGE,
                course_id:      v => ID_RULE.test(v)             || COURSE_MESSAGE,
            },
        }
    },

    computed: {
        courses() {
            const courses = this.$store.getters['CourseState/courses'];
            return courses ? courses : [];
        },
  
        trainers() {
            const trainers = this.$store.getters['TrainerState/trainers'];
            return trainers ? trainers : [];
        },

        lessons() {
            const lessons = this.$store.getters['LessonState/lessons'];
            if(!lessons) {
                return [];
            }

            return lessons.filter(lesson => !lesson.course_area_id);
        },

        imageSrc() {
            return this.image ? URL.createObjectURL(this.image) : null;
        },

        trailerSrc() {
            return this.trailer ? URL.createObjectURL(this.trailer) : null;
        },
    },

    watch: {
        trailer() {
            this.validateTrailer();
        },

        image() {
            this.validateImage();
        },

        lessons() {
            if(this.courseArea) {
                this.form.lessons = this.lessons.filter(lesson => lesson.course_area_id === this.form.id);
            }
        }
    },

    methods: {
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

            data_to_send.lessons = this.form.lessons.map(lesson => lesson.id);

            this.$store.dispatch('CourseAreaState/createCourseArea', data_to_send)
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Course Area ${this.form.name} created successfully`
                    });

                    this.$store.dispatch('LessonState/assignLessons', {lessons: data_to_send.lessons, courseArea: res.data});

                    this.$router.push('/content/course-areas')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the Course Area',
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
                return this.errors = {
                    trailer: TRAILER_MESSAGE
                };
            }

            if(!VIDEO_FILE_TYPES_RULE.includes(this.trailer.type)) {
                return this.errors = {
                    trailer: TRAILER_FILE_TYPES_MESSAGE
                };
            }

            if(this.trailer.size > TRAILER_FILE_SIZE_RULE) {
                return this.errors = {
                    trailer: TRAILER_FILE_SIZE_MESSAGE
                };
            }
        },

        validateImage() {
            if(this.errors) {
                this.errors.image = null;
            }

            if(!this.image) {
                return this.errors = {
                    image: IMAGE_MESSAGE
                };
            }

            if(!IMAGE_FILE_TYPES_RULE.includes(this.image.type)) {
                return this.errors = {
                    image: IMAGE_FILE_TYPES_MESSAGE
                };
            }

            if(this.image.size > IMAGE_FILE_SIZE_RULE) {
                return this.errors = {
                    image: IMAGE_FILE_SIZE_MESSAGE
                };
            }
        },

        setFormLessons(lessons) {
            
        }
    }
}
</script>
