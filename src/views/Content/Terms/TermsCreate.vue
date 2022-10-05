<template>
    <v-container fluid>
        <TopCard 
            text="Create Term"
        />
        
        <br>

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
import FormCard from './../../../components/Cards/FormCard.vue'
import TopCard from './../../../components/Cards/TopCard.vue'
import SubmitButton from './../../../components/Buttons/SubmitButton.vue'
import CancelButton from './../../../components/Buttons/CancelButton.vue'
import {NAME_RULE, TERM_DESCRIPTION_RULE} from './../../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE} from './../../../helpers/Messages' 

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
                name: '',
                description: '',
            },
            loading: false,
            errors: null,
            rules: {
                name:           v => NAME_RULE.test(v)              || NAME_MESSAGE,
                description:    v => TERM_DESCRIPTION_RULE.test(v)  || DESCRIPTION_MESSAGE,
            },
        }
    },
    
    methods: {
        submit() {
            this.errors = null;
            
            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            this.$store.dispatch('TermState/createTerm', this.form)
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Term ${this.form.name} created successfully`
                    });
                    this.$router.push('/content/terms')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the term',
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