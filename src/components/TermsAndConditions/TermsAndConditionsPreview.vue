<template>
    <v-card class="py-5 px-10 rtl wrap-text">
       <div v-html="termsAndCondition.content">

       </div>
    </v-card>
</template>

<script>
export default {
    components: {
    },

    props: {
        termsAndCondition: {
            type: Object,
            required: true
        }
    },
}
</script>
