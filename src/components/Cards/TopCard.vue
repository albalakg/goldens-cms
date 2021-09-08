<template>
    <v-card class="py-2 pl-5">
        <h1 class="font_title">
            {{text}}
        </h1>
    </v-card>
</template>

<script>
export default {

    props: {
        text: {
            type: String,
            required: true
        }
    }
    
}
</script>

<style scoped>
</style>