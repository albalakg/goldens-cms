<template>
    <v-container fluid>
        <TopCard 
            text="Create Course Category"
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
import {COURSE_NAME_RULE, COURSE_DESCRIPTION_RULE, ID_RULE, IMAGE_FILE_TYPES_RULE, IMAGE_FILE_SIZE_RULE} from '../../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, CATEGORY_MESSAGE, IMAGE_FILE_TYPES_MESSAGE, IMAGE_FILE_SIZE_MESSAGE, IMAGE_MESSAGE} from '../../../helpers/Messages' 

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
                course_id:    '',
            },
            image: null,
            loading: false,
            errors: null,
            rules: {
                name:           v => COURSE_NAME_RULE.test(v)           || NAME_MESSAGE,
                description:    v => COURSE_DESCRIPTION_RULE.test(v)    || DESCRIPTION_MESSAGE,
                course_id:      v => ID_RULE.test(v)                    || CATEGORY_MESSAGE,
            },
        }
    },

    computed: {
        imageSrc() {
            return this.image ? URL.createObjectURL(this.image) : null;
        },
    },

    watch: {
        image() {
            this.validateImage();
        },
    },

    methods: {
        submit() {
            this.errors = null;
            
            this.validateImage();

            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('CourseCategoryState/createCourseCategory', {...this.form, image: this.image})
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Course Category ${this.form.name} created successfully`
                    });
                    this.$router.push('/content/course-categories')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the Course Category',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
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
        }
    }
}
</script>
