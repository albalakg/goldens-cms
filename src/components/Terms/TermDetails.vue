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
import FormCard from '../Cards/FormCard.vue'
import SubmitButton from '../Buttons/SubmitButton.vue'
import CancelButton from '../Buttons/CancelButton.vue'
import { STATUSES_SELECTION } from '../../helpers/Status'
import {NAME_RULE, SKILL_DESCRIPTION_RULE} from '../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE} from '../../helpers/Messages' 

export default {
    props: {
        term: {
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
            loading: false,
            errors: null,
            rules: {
                name:           v => NAME_RULE.test(v)              || NAME_MESSAGE,
                description:    v => SKILL_DESCRIPTION_RULE.test(v) || DESCRIPTION_MESSAGE,
            },
            statuses: STATUSES_SELECTION
        }
    },

    created() {
        this.form = {...this.term};
    },

    methods: {
        submit() {
            this.errors = null;
            
            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            this.$store.dispatch('TermState/updateTerm', {...this.form, image: this.file})
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Term ${this.form.name} updated successfully`
                    });
                    this.$router.push('/content/terms')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to update the term',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    }
}
</script>

<style scoped>

.preview_term {
    width: 30%;
}

</style>