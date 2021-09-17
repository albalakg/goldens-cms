<template>
    <v-container fluid>
        <TopCard 
            text="Create Course"
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
                                <v-select
                                    outlined
                                    :items="courseCategories"
                                    item-text="name"
                                    item-value="id"
                                    v-model="form.category_id"
                                    label="Category"
                                    :rules="[rules.category_id]"
                                ></v-select>
                                <v-flex d-flex>
                                    <v-text-field
                                        outlined
                                        v-model="form.price"
                                        label="Price"
                                        :rules="[rules.price]"
                                        autocomplete="off"
                                        class="pr-3"
                                    ></v-text-field>
                                    <v-text-field
                                        outlined
                                        v-model="form.discount"
                                        label="Discount"
                                        hint="discount in precentage %"
                                        :rules="[rules.discount]"
                                        autocomplete="off"
                                        class="pl-3"
                                    ></v-text-field>
                                </v-flex>
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
import {COURSE_NAME_RULE, COURSE_DESCRIPTION_RULE, CATEGORY_RULE, PRICE_RULE, DISCOUNT_RULE, TRAILER_FILE_SIZE_RULE, VIDEO_FILE_TYPES_RULE, IMAGE_FILE_TYPES_RULE, IMAGE_FILE_SIZE_RULE} from '../../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, CATEGORY_MESSAGE, TRAILER_FILE_SIZE_MESSAGE, TRAILER_FILE_TYPES_MESSAGE, PRICE_MESSAGE, DISCOUNT_MESSAGE, IMAGE_FILE_TYPES_MESSAGE, IMAGE_FILE_SIZE_MESSAGE} from '../../../helpers/Messages' 

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
                category_id:    '',
                price:          '',
                discount:       '',
            },
            image: null,
            trailer: null,
            loading: false,
            errors: null,
            rules: {
                name:           v => COURSE_NAME_RULE.test(v)           || NAME_MESSAGE,
                description:    v => COURSE_DESCRIPTION_RULE.test(v)    || DESCRIPTION_MESSAGE,
                category_id:    v => CATEGORY_RULE.test(v)              || CATEGORY_MESSAGE,
                price:          v => PRICE_RULE.test(v)                 || PRICE_MESSAGE,
                discount:       v => DISCOUNT_RULE.test(v)              || DISCOUNT_MESSAGE,
            },
        }
    },

    created() {
        this.$store.dispatch('CourseCategoryState/getCourseCategories');
    },

    computed: {
        courseCategories() {
            const categories = this.$store.getters['CourseCategoryState/courseCategories'];
            return categories ? categories.data : [];
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
            this.$store.dispatch('CourseState/createCourse', {...this.form, image: this.image, trailer: this.trailer})
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Course ${this.form.name} created successfully`
                    });
                    this.$router.push('/content/courses')
                })
                .catch(err => {
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
        },

        validateTrailer() {
            if(this.errors) {
                this.errors.trailer = null;
            }

            if(!this.trailer) {
                return this.errors = {
                    trailer: 'Trailer is required'
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
                    image: 'Image is required'
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
        }
    }
}
</script>

<style scoped>

    .preview_image {
        max-height: 120px;
        min-height: 120px;
        width: 100%;
    }

</style>