<template>
    <div class="content_reorder_card">
        <p>
            Drag to reorder the items below
        </p>

        <br>

        <draggable v-model="updatedContent" group="people" @start="drag=true" @end="drag=false">
            <div class="reorder_record" v-for="(element, index) in updatedContent" :key="element.id">
                <strong>
                    {{++index}}.
                </strong> {{element.name}}
            </div>
        </draggable>
        
         <v-flex d-flex justify-space-between class="mt-10">
            <v-flex md12 lg6 class="pr-5">
                <CancelButton
                    :loading="loading" 
                    text="reset"
                    @submit="initialContent()"
                />
            </v-flex>
            <v-flex md12 lg6 class="pl-5">
                <SubmitButton
                    :loading="loading"
                    @submit="submit()"
                />
            </v-flex>
        </v-flex>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import SubmitButton from '../Buttons/SubmitButton.vue'
import CancelButton from '../Buttons/CancelButton.vue'

export default {
    components: {
        draggable,
        SubmitButton,
        CancelButton,
    },

    props: {
        content: {
            type: Array,
            required: true
        },

        title: {
            type: String
        },

        loading: {
            type: Boolean
        },
    },

    created() {
        this.initialContent();
    },

    data() {
        return {
            updatedContent: []
        }
    },

    methods: {
        initialContent() {
            this.updatedContent = this.content.slice();
            this.updatedContent.sort(this.compare)
        },

        compare( a, b ) {
            if ( a.view_order < b.view_order ){
                return -1;
            }
            if ( a.view_order > b.view_order ){
                return 1;
            }
            return 0;
        },
        
        submit() {
            this.updatedContent.forEach((content, index) => {
                content.view_order = ++index;
            })

            const mappedContent = this.updatedContent.map(content => {
                return {
                    id:         content.id,
                    view_order: content.view_order
                }
            });

            this.$emit('submit', mappedContent)
        }
    }
}
</script>

<style scoped>

    .content_reorder_card {
        background-color: #fff;
        padding: 10px;
        border-radius: 8px;
        width: 100%;
    }

    .reorder_record {
        padding: 5px;
        background-color: #eee;
        box-shadow: 0 3px 3px #0003;
        border-radius: 8px;
        margin-bottom: 10px;
    }

    .content_reorder_card:hover {
        cursor: grab;
    }

    .reorder_record:active {
        cursor: grabbing;
    }

</style>