<template>
    <v-card class="px-3 w100 form_card_wrapper">
        <v-card-title v-if="title" primary-title>
            {{title}}
        </v-card-title>
        <slot name="content">

        </slot>
    </v-card>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        }
    }    
}
</script>

<style scoped>

    .form_card_wrapper {
        border-left: 3px solid #0B032D;
    }

</style>