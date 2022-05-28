<template>
    <v-flex class="content_reorder_card">
        <reorder-content-card :content="[{id: 1, name: 'asd'}, {id:2, name: 'ad'}]" />
    </v-flex>
</template>

<script>
import ReorderContentCard from '../Cards/ReorderContentCard.vue';

export default {
    components: {
        ReorderContentCard,
    },

    props: {
        content: {
            type: Array,
            required: true
        }
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
            this.updatedContent = new Set(this.content)    
        },
        
        submit() {
            this.$emit('submit', this.updatedContent)
        }
    }
}
</script>

<style scoped>

    .content_reorder_card {
        width: 50%;
    }

</style>