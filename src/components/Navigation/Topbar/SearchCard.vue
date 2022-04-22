<template>
<div>
    <v-dialog
      v-model="isVisible"
      width="600px"
      :overlay-opacity="0.9"	
      @click:outside="close()"
      @keypress.prevent="keyAction"
    >
        <v-card class="search_card_wrapper">
            <v-form class="pt-10 pb-5 px-5" @submit.prevent="submit">
                <v-text-field
                    autofocus	
                    ref="searchInput"
                    outlined
                    label="Search..."
                    v-model="value"
                    hint="press Enter to enter the first record"
                    @input="search"
                    @keydown="focusResults"
                >
                </v-text-field>

                <v-card-title class="pa-0 mb-3" primary-title>
                    Results: {{results ? results.length : 0}}
                </v-card-title>

                <div class="results_wrapper pr-2">
                    <template v-for="(result, index) in results">
                        <v-flex 
                            :key="index"
                            justify-space-between
                            class="result_record"
                            @click="enterResult(result)"
                        >
                            <span>
                                {{result.text}}
                            </span>
                            <span>
                                {{result.type}}
                            </span>
                        </v-flex>
                    </template>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            value: '',
        }
    },

    computed: {
        isVisible() {
            return this.$store.getters['AppState/globalSearchState'];
        },

        results() {
            return this.$store.getters['SearchState/results'];
        },

        isLoading() {
            return this.$store.getters['AppState/isLoading'];
        }
    },

    methods: {
        close() {
            this.resetSearch();
        },

        search(value) {
            this.searchState = this.$store.dispatch('SearchState/search', value ?? '')
        },

        submit() {
            this.enterResult(this.results[0]);
        },

        enterResult(result) {
            if(!result) {
                return;
            }
            
            this.$router.push(result.path);
            setTimeout(() => {
                this.resetSearch();
            }, 0);
        },

        resetSearch() {
            this.value = '';
            this.searchState = this.$store.dispatch('AppState/updateGlobalSearchState', false);
            this.searchState = this.$store.dispatch('SearchState/emptyResults')
        },

        focusResults(event) {
            if(event.key === 'ArrowDown') {
                this.goDown
            }
        }
    }
}
</script>

<style scoped>

    .search_card_wrapper {
        min-height: 450px;
        max-height: 80vh;
    }

    .result_record {
        padding: 5px 10px;
        background-color: #00000011;
        margin-bottom: 10px;
        border-radius: 12px;
        cursor: pointer;
        transition: .2s background-color linear;
    }

    .result_record:hover {
        background-color: #00000033;
    }

    .results_wrapper {
        overflow-y: auto;
        max-height: 250px;
    }

</style>