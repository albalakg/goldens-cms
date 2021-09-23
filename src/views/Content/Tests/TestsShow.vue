<template>
    <v-container fluid class="video_show_wrapper">
        
        <div v-if="editedVideo">
            <TopCard 
                :text="'Video ' + editedVideo.full_name"
            />

            <br>
            
            <v-tabs vertical class="video_show_card">
                <template v-for="(tab, index) in tabs">
                    <v-tab :key="index">
                        {{tab.text}}
                    </v-tab>
                </template>

                <template v-for="(tab, index) in tabs">
                    <v-tab-item :key="index">

                        <div class="pl-5">
                            <component :video="editedVideo" :is="tab.component" />
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
import VideoDetails from '../../../components/Videos/VideoDetails.vue'

export default {
    components: {
        FormLoader,
        TopCard,
        VideoDetails,
    },

    data() {
        return {
            tabs: [
                { 
                    text: 'Details', 
                    component: 'VideoDetails', 
                },
            ],
            editedVideo: null,
        }
    },

    created() {
        return this.getVideo();
    },

    watch: {
        videos() {
            this.getVideo();
        }
    },

    computed: {
        videos() {
            return this.$store.getters['VideoState/videos'];
        }
    },

    methods: {
        async getVideo() {
            this.editedVideo = await this.$store.dispatch('VideoState/getVideo', this.$route.params.videoID);
        },

        submit() {
            this.errors = null;
            if(!this.$refs.form.validate()) {
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('VideoState/createVideo', this.form)
                .then(res => {
                    console.log('res', res);
                    this.$store.dispatch('MessageState/addMessage', {
                        message: `Video ${this.form.first_name} ${this.form.last_name} created successfully`
                    });
                    this.$router.push('/videos')
                })
                .catch(err => {
                    console.log('err', err);
                    this.errors = err.errors;
                    this.$store.dispatch('MessageState/addMessage', {
                        message: 'Failed to create the video',
                        type: 'error',
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
}
</script>

<style scoped>

    .video_show_card {
        min-height: 70vh;
    }

    ::v-deep .v-window {
        background-color: #eeeef1 !important;
    }

</style>