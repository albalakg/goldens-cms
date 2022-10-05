<template>
    <v-container fluid class="skill_show_wrapper">
        
        <div v-if="editedSkill">
            <TopCard 
                :text="'Skill ' + editedSkill.name"
            />

            <br>
            
            <v-tabs vertical class="skill_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :skill="editedSkill" :is="tab.component" />
                        </div>
                    </v-tab-item>
                </template>
            </v-tabs>
        </div>

        <FormLoader v-else />

    </v-container>
</template>

<script>
import FormLoader from '../../../components/Loaders/FormLoader.vue'
import TopCard from '../../../components/Cards/TopCard.vue'
import SkillDetails from '../../../components/Skills/SkillDetails.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        SkillDetails,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'SkillDetails', 
                },
            ],
            editedSkill: null,
        }
    },

    created() {
        return this.getSkill();
    },

    watch: {
        skills() {
            this.getSkill();
        }
    },

    computed: {
        skills() {
            return this.$store.getters['SkillState/skills'];
        }
    },

    methods: {
        async getSkill() {
            this.editedSkill = await this.$store.dispatch('SkillState/getSkill', this.$route.params.skillID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('SkillState/createSkill', this.form)
                .then(() => {
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Skill ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/skills')
                })
                .catch(err => {
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the skill',
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

    .skill_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>