<template>
    <v-container fluid>
        <TopCard text="Update Challenge" />

        <br>

        <v-form @submit.prevent="submit()" ref="form">
            <v-flex d-flex>
                <v-flex xs12 lg6 class="pr-5">
                    <FormCard title="Details">
                        <template slot="content">
                            <div class="px-4">
                                <v-text-field outlined v-model="form.name" counter maxlength="40" label="Name"
                                    :rules="[rules.name]"></v-text-field>
                                <VueEditor v-model="form.description" placeholder="Description" class="text_editor" />

                                <v-autocomplete outlined :loading="!videos" :items="videos" item-text="name" item-value="id"
                                    v-model="form.video_id" label="Video" :rules="[rules.video_id]"></v-autocomplete>

                                <v-file-input outlined show-size v-model="image" label="Image" prepend-icon=""
                                    :error-messages="errors && errors.image ? errors.image : ''"></v-file-input>
                                <img v-if="imageSrc" class="preview_image" :src="imageSrc" alt="">

                                <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field outlined v-model="date" label="Expired At" readonly v-bind="attrs"
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" no-title scrollable :min="today">
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="menu = false">
                                            Cancel
                                        </v-btn>
                                        <v-btn text color="primary" @click="$refs.menu.save(date)">
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                                <v-time-picker v-model="time" landscape format="24hr"></v-time-picker>
                                <br>
                                <br>
                                <v-flex d-flex align-center v-for="(trainingOption, index) in form.options" :key="index">
                                    <v-autocomplete 
                                        v-model="form.options[index].id" 
                                        :items="trainingOptions"
                                        label="Options" 
                                        item-text="name" 
                                        item-value="id" 
                                        outlined 
                                        class="mr-md-3"
                                        :rules="[rules.trainingOption]">
                                    </v-autocomplete>
                                    <v-text-field 
                                        outlined 
                                        v-model.number="form.options[index].value" 
                                        label="Value"
                                        type="number" 
                                        :rules="[rules.trainingOptionValue]">
                                    </v-text-field>
                                    <v-icon 
                                        color="red" 
                                        class="mx-1 mb-7" 
                                        @click="deleteTrainingOption(index)
                                    ">
                                        mdi-trash-can-outline
                                    </v-icon>
                                </v-flex>

                                <primary-button 
                                    :disabled="hasAvailableTrainingOptions" 
                                    text="Add Option"
                                    @submit="addTrainingOption()" 
                                />
                                <br>
                            </div>
                        </template>
                    </FormCard>
                </v-flex>
            </v-flex>

            <v-flex d-flex justify-space-between class="mt-10">
                <v-flex md12 lg6 class="pr-5">
                    <CancelButton goBack />
                </v-flex>
                <v-flex md12 lg6 class="pl-5">
                    <SubmitButton :loading="loading" @submit="submit()" />
                </v-flex>
            </v-flex>
        </v-form>

    </v-container>
</template>

<script>
import FormCard from '../Cards/FormCard.vue'
import TopCard from '../Cards/TopCard.vue'
import SubmitButton from '../Buttons/SubmitButton.vue'
import CancelButton from '../Buttons/CancelButton.vue'
import { ID_RULE, NAME_RULE, LESSON_DESCRIPTION_RULE, TRAINING_OPTION_VALUE_RULE, IMAGE_FILE_TYPES_RULE, IMAGE_FILE_SIZE_RULE } from '../../helpers/Rules'
import { NAME_MESSAGE, DESCRIPTION_MESSAGE, VIDEO_MESSAGE, TRAINING_OPTION_MESSAGE, TRAINING_OPTION_VALUE_MESSAGE, IMAGE_FILE_TYPES_MESSAGE, IMAGE_FILE_SIZE_MESSAGE, IMAGE_MESSAGE } from '../../helpers/Messages'
import { VueEditor } from "vue2-editor";
import PrimaryButton from '../Buttons/PrimaryButton'

export default {
    components: {
        FormCard,
        TopCard,
        SubmitButton,
        CancelButton,
        VueEditor,
        PrimaryButton,
    },

    props: {
        challenge: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            form: {
                name:           '',
                description:    '',
                video_id:       '',
                options:        [],
            },
            today: new Date().toISOString().substr(0, 10),
            date: '',
            time: '',
            menu: false,
            image: null,
            loading: false,
            errors: null,
            rules: {
                name: v => NAME_RULE.test(v) || NAME_MESSAGE,
                description: v => LESSON_DESCRIPTION_RULE.test(v) || DESCRIPTION_MESSAGE,
                video_id: v => ID_RULE.test(v) || VIDEO_MESSAGE,
                trainingOption: v => ID_RULE.test(v) || TRAINING_OPTION_MESSAGE,
                trainingOptionValue: v => TRAINING_OPTION_VALUE_RULE.test(v) || TRAINING_OPTION_VALUE_MESSAGE,
            },
        }
    },

    created() {
        this.form = { ...this.challenge };
        this.course_id = this.challenge.course_id;

        this.form.options = this.challenge.options.map(trainingOption => {
            return {
                id: trainingOption.training_option_id ? trainingOption.training_option_id : trainingOption.id,
                value: trainingOption.value
            }
        });

        this.date = DateService.getDateOnly(this.challenge.expired_at);
        this.time = DateService.getTimeOnly(this.challenge.expired_at);

        delete this.form.image;
    },

    computed: {
        videos() {
            const data = this.$store.getters['VideoState/videos'];
            return data ? data : [];
        },

        trainingOptions() {
            const data = this.$store.getters['TrainingOptionState/trainingOptions'];
            if (!data) {
                return [];
            }

            return data.filter(trainingOption => {
                const activeTrainingOptionsIds = this.form.options.map(trainingOption => trainingOption.id);
                trainingOption.disabled = activeTrainingOptionsIds.includes(trainingOption.id);
                return trainingOption;
            })
        },

        hasAvailableTrainingOptions() {
            return !(this.trainingOptions.filter(trainingOption => !trainingOption.disabled).length)
        },

        imageSrc() {
            return this.image ? URL.createObjectURL(this.image) : this.form.imageSrc;
        },
    },

    methods: {
        submit() {
            this.errors = null;

            if (!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            this.$store.dispatch('ChallengeState/updateChallenge', {
                ...this.form,
                expired_at: DateService.formatDateToISOString(new Date(this.date + ' ' + this.time)),
                image: this.image
            })
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Challenge ${this.form.name} updated successfully`
                    });
                    this.$router.push('/content/challenges')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the challenge',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        addTrainingOption() {
            this.form.options.push({
                id: null,
                value: ''
            });
        },

        deleteTrainingOption(index) {
            this.form.options.splice(index, 1)
        },

        validateImage() {
            if (this.errors) {
                this.errors.image = null;
            }

            if (!this.image) {
                return this.errors = {
                    image: IMAGE_MESSAGE
                };
            }

            if (!IMAGE_FILE_TYPES_RULE.includes(this.image.type)) {
                return this.errors = {
                    image: IMAGE_FILE_TYPES_MESSAGE
                };
            }

            if (this.image.size > IMAGE_FILE_SIZE_RULE) {
                return this.errors = {
                    image: IMAGE_FILE_SIZE_MESSAGE
                };
            }
        },
    }
}
</script>

<style scoped></style>