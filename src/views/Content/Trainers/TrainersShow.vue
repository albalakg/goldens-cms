<template>
    <v-container fluid v-if="editedTrainer">
        <TopCard 
            :text="`Update Trainer ${editedTrainer.name}`"
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
                                    counter
                                    maxlength="40"
                                    label="Name"
                                    :rules="[rules.name]"
                                ></v-text-field>

                                <v-text-field
                                    outlined
                                    v-model="form.title"
                                    counter
                                    maxlength="100"
                                    label="Title"
                                    :rules="[rules.title]"
                                ></v-text-field>

                                <VueEditor 
                                    v-model="form.description"
                                    class="text_editor"
                                />

                                <v-select
                                    outlined
                                    :items="statuses"
                                    item-text="text"
                                    item-value="value"
                                    v-model="form.status"
                                    label="Status"
                                ></v-select>

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
import { STATUSES_SELECTION } from './../../../helpers/Status'
import {NAME_RULE, TRAINER_DESCRIPTION_RULE, IMAGE_FILE_TYPES_RULE, IMAGE_FILE_SIZE_RULE, TRAINER_TITLE_RULE} from '../../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, IMAGE_FILE_TYPES_MESSAGE, IMAGE_FILE_SIZE_MESSAGE, IMAGE_MESSAGE, TITLE_MESSAGE} from '../../../helpers/Messages' 
import { VueEditor } from "vue2-editor";

export default {
    components: {
        FormCard,
        TopCard,
        SubmitButton,
        CancelButton,
        VueEditor,
    },

    data() {
        return {
            form: null,
            editedTrainer: null,
            image: null,
            loading: false,
            errors: null,
            statuses: STATUSES_SELECTION,
            rules: {
                name:           v => NAME_RULE.test(v)                  || NAME_MESSAGE,
                title:          v => TRAINER_TITLE_RULE.test(v)         || TITLE_MESSAGE,
                description:    v => TRAINER_DESCRIPTION_RULE.test(v)   || DESCRIPTION_MESSAGE,
            },
        }
    },

    created() {
        this.getTrainer();
    },

    computed: {
        imageSrc() {
            return this.image ? URL.createObjectURL(this.image) : this.form.imageSrc;
        },
    },

    methods: {
        async getTrainer() {
            this.editedTrainer  = await this.$store.dispatch('TrainerState/getTrainer', this.$route.params.trainerID);
            this.form           = {...this.editedTrainer}
        },

        submit() {
            this.errors = null;
            
            this.validateImage();
            if(!this.$refs.form.validate() || this.errors) {
                return;
            }


            this.loading = true;
            this.$store.dispatch('TrainerState/updateTrainer', {...this.form, image: this.image})
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Trainer ${this.form.name} updated successfully`
                    });
                    this.$router.push('/content/trainers')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the Trainer',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        
        validateImage() {
            if(!this.image) {
                return;
            }
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

<style scoped>
</style>