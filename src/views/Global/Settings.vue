<template>
    <div>
        <TopCard 
            text="Settings"
        />

        <br>

        <v-flex d-flex mx-auto md9>
            <v-flex md3 class="settings_sidebar">
                Hot Keys
            </v-flex>
            <div class="settings_content">
                <template v-for="(item, index) in hotKeys">
                    <v-flex align-center justify-space-between d-flex :key="index" class="mb-4">
                        <v-flex md5>
                            <v-chip class="ctl">{{item.keys}}</v-chip>
                        </v-flex>
                        <div md3>
                            <span>
                                {{item.description}}
                            </span>
                        </div>
                    </v-flex>
                    <div v-if="index + 1 != hotKeys.length" :key="index + 'sep'" class="px-10">
                        <div class="seperator mb-4"></div>
                    </div>
                </template>
            </div>
        </v-flex>

        <br><br>

        <v-flex d-flex mx-auto md9>
            <v-flex md3 class="settings_sidebar">
                Languages
            </v-flex>
            <div class="settings_content">
                <v-form>
                    <v-autocomplete
                        outlined
                        label="Language"
                        :items="languages"
                        v-model="language"
                    ></v-autocomplete>
                    <SubmitButton
                        @submit="updateLanguage()"
                        disabled
                        :title="'Cannot change the language at the moment'"
                    />
                </v-form>
            </div>
        </v-flex>
    </div>
</template>

<script>
import SubmitButton from '../../components/Buttons/SubmitButton.vue'
import TopCard from './../../components/Cards/TopCard.vue'

export default {
    components: {
        TopCard,
        SubmitButton,
    },

    data() {
        return {
            hotKeys: [
                {
                    keys: 'Alt + E',
                    description: 'פותח/סוגר את התפריט'
                },
                {
                    keys: 'Alt + F',
                    description: 'פותח/סוגר את החיפוש הגלובלי'
                },
                {
                    keys: 'Alt + D',
                    description: 'פותח את עמוד הבית'
                },
                {
                    keys: 'Alt + Q',
                    description: 'פותח את עמוד הפרופיל'
                },
                {
                    keys: 'Alt + S',
                    description: 'פותח את עמוד ההגדרות'
                },
            ],
            language: '',
            languages: [
                'English',
                'עברית'
            ]
        }
    },

    created() {
        this.language = this.$store.getters['AppState/language'];
    },

    methods: {
        updateLanguage() {

        }
    }
}
</script>

<style scoped>

    .settings_sidebar {
        padding: 10px;
        font-weight: bold;
    }

    .settings_content {
        background-color: #fff;
        padding: 20px;
        border-radius: 12px;
        width: 100%;
    }

    .ctl {
        font-weight: bold;
    }

</style>