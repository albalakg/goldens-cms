<template>
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
                            label="Image"
                            prepend-icon=""
                            :error-messages="errors && errors.file ? errors.file : ''"
                        ></v-file-input>
                        <img ref="skill" class="preview_skill" :src="imageSrc" />
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
</template>

<script>
import FormCard from './../../components/Cards/FormCard.vue'
import SubmitButton from './../../components/Buttons/SubmitButton.vue'
import CancelButton from './../../components/Buttons/CancelButton.vue'
import { STATUSES_SELECTION } from './../../helpers/Status'
import {NAME_RULE, SKILL_DESCRIPTION_RULE, IMAGE_FILE_SIZE_RULE, IMAGE_FILE_TYPES_RULE} from './../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, IMAGE_FILE_SIZE_MESSAGE, IMAGE_FILE_TYPES_MESSAGE} from './../../helpers/Messages' 

export default {
    props: {
        skill: {
            type: Object,
            required: true
        }
    },

    components: {
        FormCard,
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
                name:           v => NAME_RULE.test(v)        || NAME_MESSAGE,
                description:    v => SKILL_DESCRIPTION_RULE.test(v) || DESCRIPTION_MESSAGE,
            },
            statuses: STATUSES_SELECTION
        }
    },

    computed: {
        imageSrc() {
            return this.file ? URL.createObjectURL(this.file) : this.skill.imageSrc;
        }
    },

    created() {
        this.form = {...this.skill};
    },

    methods: {
        submit() {
            this.errors = null;
            
            this.validateFile();

            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            this.$store.dispatch('SkillState/updateSkill', {...this.form, image: this.file})
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Skill ${this.form.name} updated successfully`
                    });
                    this.$router.push('/content/skills')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the skill',
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

            if(!IMAGE_FILE_TYPES_RULE.includes(this.file.type)) {
                return this.errors = {
                    file: IMAGE_FILE_TYPES_MESSAGE
                };
            }

            if(this.file.size > IMAGE_FILE_SIZE_RULE) {
                return this.errors = {
                    file: IMAGE_FILE_SIZE_MESSAGE
                };
            }
        }
    }
}
</script>

<style scoped>

.preview_skill {
    width: 30%;
}

</style>