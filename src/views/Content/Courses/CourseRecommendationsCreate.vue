<template>
    <v-container fluid>
        <TopCard 
            text="Create Course Recommendations"
        />
        
        <br>

        <v-form @submit.prevent="submit()" ref="form">
            <v-flex d-flex>
                <v-flex xs12 lg6 class="pr-5">
                    <FormCard
                        createable
                        title="Recommendations"
                        @add="addRecommendation()"
                    >
                        <template slot="content">
                            <div class="recommendation_wrapper px-4 mb-4" v-for="(recommendation, index) in form.recommendations" :key="index">
                                <v-flex class="mb-1" d-flex justify-space-between align-center>
                                    <small>
                                        <strong>
                                            Recommendation {{ index + 1 }}
                                        </strong>
                                    </small>

                                    <v-icon :disabled="cantDeleteRecommendation" color="red" class="pointer" @click="deleteRecommendation(index)">mdi-trash-can-outline</v-icon>
                                </v-flex>

                                <div>
                                    <v-text-field
                                        outlined
                                        v-model="form.recommendations[index].name"
                                        label="Person Name"
                                        counter
                                        maxlength="100"
                                        :rules="[rules.name]"
                                    ></v-text-field>
                                    <v-textarea
                                        outlined
                                        v-model="form.recommendations[index].content"
                                        counter
                                        maxlength="250"
                                        label="Recommendation"
                                        :rules="[rules.description]"
                                    ></v-textarea>
                                </div>
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
import {NAME_RULE, DESCRIPTION_RULE, ID_RULE} from '../../../helpers/Rules' 
import {NAME_MESSAGE, DESCRIPTION_MESSAGE, CATEGORY_MESSAGE} from '../../../helpers/Messages' 

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
                course_id: '',
                recommendations: []
            },
            image: null,
            trailer: null,
            loading: false,
            errors: null,
            rules: {
                name:           v => NAME_RULE.test(v)           || NAME_MESSAGE,
                description:    v => DESCRIPTION_RULE.test(v)    || DESCRIPTION_MESSAGE,
                category_id:    v => ID_RULE.test(v)             || CATEGORY_MESSAGE,
            },
        }
    },

    created() {
        this.form.course_id = this.$route.query.course_id;
        this.addRecommendation();
    },

    computed: {
        cantDeleteRecommendation() {
            return this.form.recommendations.length === 1;
        }
    },

    methods: {
        submit() {
            this.errors = null;
            

            if(!this.$refs.form.validate() || this.errors) {
                return;
            }

            this.loading = true;
            this.$store.dispatch('CourseState/createCourseRecommendations', this.form)
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Course recommendations created successfully`
                    });
                    this.$router.go(-1)
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the course recommendations',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        addRecommendation() {
            this.form.recommendations.push({
                name: '',
                content: ''
            })
        },

        deleteRecommendation(index) {
            this.form.recommendations.splice(index, 1)
        }
    }
}
</script>
