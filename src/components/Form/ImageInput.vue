<template>
    <div>
        <v-file-input
            outlined
            show-size
            v-model="image"
            label="Image"
            prepend-icon=""
            :error-messages="errors && errors.image ? errors.image : ''"
        ></v-file-input>
        <img v-if="imageSrc" class="preview_image" :src="imageSrc" alt="">
    </div>
</template>

<script>
import {IMAGE_FILE_TYPES_RULE, IMAGE_FILE_SIZE_RULE} from '../../helpers/Rules' 
import {IMAGE_FILE_TYPES_MESSAGE, IMAGE_FILE_SIZE_MESSAGE, IMAGE_MESSAGE} from '../../helpers/Messages' 

export default {
    props: {
        image: {
            type: [Object, null],
            required: true
        }
    },

    computed: {
        imageSrc() {
            return this.image ? URL.createObjectURL(this.image) : null;
        },
    },

    methods: {
        validateImage() {
            if(this.errors) {
                this.errors.image = null;
            }

            if(!this.image) {
                return this.errors = {
                    image: IMAGE_MESSAGE
                };
            }

            if(!IMAGE_FILE_TYPES_RULE.includes(this.image.type)) {
                return this.errors = {
                    image: IMAGE_FILE_TYPES_MESSAGE
                };
            }

            if(this.image.size > IMAGE_FILE_SIZE_RULE) {
                return this.errors = {
                    image: IMAGE_FILE_SIZE_MESSAGE
                };
            }
        },
    }
}
</script>

<style scoped>
</style>