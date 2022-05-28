const TEMPLATES_TYPES_COUNT = 5;

const SearchState = {
    namespaced: true,

    state: {
        results: [],
        templates: [
            // EXACT VALUES
            {
                field: 'email',
                components: ['UserState/searchByEmail'],
                template: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
            },
            {
                field: 'phone',
                components: ['UserState/searchByPhone'],
                template: /^\d{9,10}$/
            },
            {
                field: 'order_number',
                components: ['OrderState/searchByOrderNumber'],
                template: /^ON\d{8}$/
            },
            {
                field: 'support_number',
                components: ['SupportState/searchBySupportNumber'],
                template: /^SN\d{8}$/
            },
        
            // PART OF THE VALUE
            {
                field: 'name',
                components: ['UserState/searchByName'],
                template: /.+/
            },
            {
                field: 'name',
                components: ['CourseState/searchByName'],
                template: /.+/
            },
            {
                field: 'name',
                components: ['LessonState/searchByName'],
                template: /.+/
            },
            {
                field: 'name',
                components: ['CourseAreaState/searchByName'],
                template: /.+/
            },
            {
                field: 'email',
                components: ['UserState/searchByEmail'],
                template: /.+@/
            },
            {
                field: 'phone',
                components: ['UserState/searchByPhone'],
                template: /^05[2,3,4,5,6,7,8,9]{1,10}/
            },
            {
                field: 'order_number',
                components: ['OrderState/searchByOrderNumber'],
                template: /^O?N?\d{1,8}$/
            },
            {
                field: 'support_number',
                components: ['SupportState/searchBySupportNumber'],
                template:/^SN?\d{1,8}$/
            },
          ],
    },

    getters: {
        results: state => state.results,
    },

    mutations: {
        SET_RESULTS(state, results) {
            state.results = results;
        }
    },

    actions: {
        emptyResults({ commit } ) {
            commit('SET_RESULTS', []);
        },

        search({ commit, dispatch }, searchInput) {
            return new Promise(async (resolve, reject) => {
                try {
                    searchInput = searchInput.trim().toLowerCase();
                    if(!searchInput) {
                        dispatch('emptyResults');
                        return resolve([]);
                    }
                    
                    const prioritized_components = await dispatch('prioritize_search', searchInput);
                    const results = await dispatch('fetch_results', {prioritized_components, searchInput});

                    commit('SET_RESULTS', results)
                    resolve(results);
                } catch(err) {
                    console.error(err);
                    resolve([]);
                }
            });
        },
                
        prioritize_search({state}, searchInput) {
            const prioritized_components = [];

            // insert template if has match
            state.templates.forEach(item => {
                const matches = searchInput.match(item.template);
                if(matches && matches.length) {
                    prioritized_components.push(item)
                }
            });

            // insert templates leftovers by order
            if(prioritized_components.length < TEMPLATES_TYPES_COUNT) {
                state.templates.forEach(template_item => {
                    if(!prioritized_components.find(prioritized_item => prioritized_item.field === template_item.field)) {
                    prioritized_components.push(template_item)
                    }
                })
            }

            return prioritized_components;
        },

        async fetch_results({ dispatch }, data) {
            let results = [];
            for(let priority_index = 0; priority_index < data.prioritized_components.length; priority_index++) {
                const item = data.prioritized_components[priority_index];
        
                for(let item_index = 0; item_index < item.components.length; item_index++) {
                    try {
                        const component = item.components[item_index];
                        const new_search_results = await dispatch(component, data.searchInput, {root:true});
                        if(new_search_results && new_search_results.length) {
                            results = results.concat(new_search_results);
                        }
                    } catch(err) {
                        console.error(err);
                    }
                }
            }
        
            return results;
        }
    }
};

export default SearchState;
