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
</template>

<script>
import FormCard from '../Cards/FormCard.vue'
import TopCard from '../Cards/TopCard.vue'
import SubmitButton from '../Buttons/SubmitButton.vue'
import CancelButton from '../Buttons/CancelButton.vue'
import { STATUSES_SELECTION } from '../../helpers/Status'
import {NAME_RULE, DESCRIPTION_RULE, ID_RULE, TRAILER_FILE_SIZE_RULE, VIDEO_FILE_TYPES_RULE, IMAGE_FILE_TYPES_RULE, IMAGE_FILE_SIZE_RULE} from '../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, CATEGORY_MESSAGE, TRAILER_FILE_SIZE_MESSAGE, TRAILER_FILE_TYPES_MESSAGE, IMAGE_FILE_TYPES_MESSAGE, IMAGE_FILE_SIZE_MESSAGE} from '../../helpers/Messages' 

export default {
    components: {
        FormCard,
        TopCard,
        SubmitButton,
        CancelButton,
    },

    props: {
        courseCategory: {
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
            },
            image: null,
            trailer: null,
            loading: false,
            errors: null,
            rules: {
                name:           v => NAME_RULE.test(v)           || NAME_MESSAGE,
                description:    v => DESCRIPTION_RULE.test(v)    || DESCRIPTION_MESSAGE,
                course_id:      v => ID_RULE.test(v)                    || CATEGORY_MESSAGE,
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

        imageSrc() {
            return this.image ? URL.createObjectURL(this.image) : 
                    this.courseCategory.imageSrc ? this.courseCategory.imageSrc : null;
        },

        trailerSrc() {
            return this.trailer ? URL.createObjectURL(this.trailer) : 
                    this.courseCategory.trailerSrc ? this.courseCategory.trailerSrc : null;
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
            this.form = {...this.courseCategory};
            
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
            
            this.$store.dispatch('CourseCategoryState/updateCourseCategory', {...this.form, image: this.image, trailer: this.trailer})
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Course Category ${this.form.name} updated successfully`
                    });
                    this.$router.push('/content/course-categories')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the Course Category',
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
        }
    }
}
</script>
