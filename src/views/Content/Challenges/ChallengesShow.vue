<template>
    <v-container fluid class="challenge_show_wrapper">
        
        <div v-if="editedChallenge">
            <TopCard 
                :text="'Challenge ' + editedChallenge.name"
            />

            <br>
            
            <v-tabs vertical class="challenge_show_card">
                <v-tab v-for="(tab, index) in tabs" :key="index">
                    {{tab.text}}
                </v-tab>

                <v-tab-item v-for="(tab, index) in tabs" :key="index">

                    <div class="pl-5">
                        <component :challenge="editedChallenge" :is="tab.component" />
                    </div>
                </v-tab-item>
            </v-tabs>
        </div>

        <FormLoader v-else />

    </v-container>
</template>

<script>
import FormLoader from '../../../components/Loaders/FormLoader.vue'
import TopCard from '../../../components/Cards/TopCard.vue'
import ChallengeDetails from '../../../components/Challenges/ChallengeDetails.vue'
import ChallengeAttempts from '../../../components/Challenges/ChallengeAttempts.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        ChallengeDetails,
        ChallengeAttempts,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'ChallengeDetails', 
                },
                { 
                    text: 'Attempts', 
                    component: 'ChallengeAttempts', 
                },
            ],
            editedChallenge: null,
        }
    },

    created() {
        return this.getChallenge();
    },

    watch: {
        challenges() {
            this.getChallenge();
        }
    },

    computed: {
        challenges() {
            return this.$store.getters['ChallengeState/challenges'];
        }
    },

    methods: {
        async getChallenge() {
            this.editedChallenge = await this.$store.dispatch('ChallengeState/getChallenge', this.$route.params.challengeID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('ChallengeState/createChallenge', this.form)
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Challenge ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/challenges')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the challenge',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
}
</script>

<style scoped>

    .challenge_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>