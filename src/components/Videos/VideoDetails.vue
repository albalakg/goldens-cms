<template>
    <v-container fluid>
        <v-form @submit.prevent="submit()" ref="form">
            <v-flex>
                <FormCard
                >
                    <template slot="content">
                        <div class="px-4">
                            <v-text-field
                                outlined
                                v-model="form.name"
                                counter
                                maxlength="40"
                                label="Name"
                                class="pr-2"
                                :rules="[rules.name]"
                            ></v-text-field>
                            <v-textarea
                                outlined
                                counter
                                maxlength="1000"
                                v-model="form.description"
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
                            <v-file-input
                                outlined
                                show-size
                                v-model="file"
                                label="Video File"
                                prepend-icon=""
                                :error-messages="errors && errors.file ? errors.file : ''"
                            ></v-file-input>
                            <video class="preview_video" controls :src="videoSrc"></video>
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
import FormCard from './../../components/Cards/FormCard.vue'
import TopCard from './../../components/Cards/TopCard.vue'
import SubmitButton from './../../components/Buttons/SubmitButton.vue'
import CancelButton from './../../components/Buttons/CancelButton.vue'
import { STATUSES_SELECTION } from './../../helpers/Status'
 import {VIDEO_NAME_RULE, VIDEO_DESCRIPTION_RULE, VIDEO_FILE_SIZE_RULE, VIDEO_FILE_TYPES_RULE} from './../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, VIDEO_FILE_SIZE_MESSAGE, VIDEO_FILE_TYPES_MESSAGE} from './../../helpers/Messages' 

export default {
    props: {
        video: {
            type: Object,
            required: true
        }
    },

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
            },
            file: null,
            loading: false,
            errors: null,
            rules: {
                name:           v => VIDEO_NAME_RULE.test(v)        || NAME_MESSAGE,
                description:    v => VIDEO_DESCRIPTION_RULE.test(v) || DESCRIPTION_MESSAGE,
            },
            statuses: STATUSES_SELECTION
        }
    },

    computed: {
        videoSrc() {
            return this.file ? URL.createObjectURL(this.file) : 
                    this.video.file ? URL.createObjectURL(this.video.file) : this.video.video;
        },
    },

    created() {
        this.form = {...this.video};
    },

    methods: {
        submit() {
            this.errors = null;
            
            this.validateFile();

            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            this.$store.dispatch('VideoState/updateVideo', {...this.form, file: this.file})
                .then(res => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Video ${this.form.name} updated successfully`
                    });
                    this.$router.push('/content/videos')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the video',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        validateFile() {
            if(!this.file) {
                return;
            }

            if(!VIDEO_FILE_TYPES_RULE.includes(this.file.type)) {
                return this.errors = {
                    file: VIDEO_FILE_TYPES_MESSAGE
                };
            }

            if(this.file.size > VIDEO_FILE_SIZE_RULE) {
                return this.errors = {
                    file: VIDEO_FILE_SIZE_MESSAGE
                };
            }
        }
    }
}
</script>

<style scoped>

.preview_video {
    width: 30%;
}

</style>