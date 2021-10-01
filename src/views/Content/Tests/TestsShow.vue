<template>
    <v-container fluid class="test_show_wrapper">
        
        <div v-if="editedTest">
            <TopCard 
                :text="'Test'"
            />

            <br>
            
            <v-tabs vertical class="test_show_card" v-model="currentTab">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index" @click="setTab(index)">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :test="editedTest" :is="tab.component" />
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
import TestDetails from '../../../components/Tests/TestDetails.vue'
import TestComments from '../../../components/Tests/TestComments.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        TestDetails,
        TestComments,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'TestDetails', 
                },
                { 
                    text: 'Comments', 
                    component: 'TestComments', 
                },
            ],
            editedTest: null,
            currentTab: 0,
        }
    },

    created() {
        this.goToTab()
        this.getTest();
    },

    watch: {
        tests() {
            this.getTest();
        }
    },

    computed: {
        tests() {
            return this.$store.getters['TestState/tests'];
        }
    },

    methods: {
        async getTest() {
            this.editedTest = await this.$store.dispatch('TestState/getTest', this.$route.params.testID);
        },

        setTab(index) {
            this.$router.push(
                {
                    path: this.$route.path,
                    query: { 
                        tab: index
                    }
                }
            )
        },
        
        goToTab() {
            this.currentTab = Number(this.$route.query.tab);
        },
    }
}
</script>

<style scoped>

    .test_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>