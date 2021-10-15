<template>
    <v-container fluid>
        <TopCard 
            text="Videos"
            createable
            reloadable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="videos"
            :loading="loadingVideos"
            :filterStatus="statuses"
            viewable
            deleteable
            searchable
            multiple
            mainField="name"
            @delete="deleteItems"
            @view="viewItem"
            @filterByStatus="filterByStatus"
        />
    </v-container>
</template>

<script>
import TopCard from './../../../components/Cards/TopCard.vue'
import TableCard from './../../../components/Cards/TableCard.vue'
import { STATUSES_SELECTION, STATUSES_VALUES } from './../../../helpers/Status'

export default {
    components: {
        TopCard,
        TableCard
    },

    data() {
        return {
            headers: [
                { text: 'Name',         value: 'name' },
                { text: 'Description',  value: 'description' },
                { text: 'Video',        value: 'video' },
                { text: 'Created At',   value: 'created_at' },
                { text: 'Status',       value: 'status',    align: 'right' },
                { text: 'Actions',      value: 'actions',   align: 'right' },
            ],
            search: '',
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        videos() {
            let videos = this.$store.getters['VideoState/videos'];

            if(!videos) {
                return [];
            }

            // filter by status
            return videos.filter(video => this.filterStatuses.includes(video.status))
        },

        loadingVideos() {
            return !this.$store.getters['VideoState/videos'];
        }
    },

    methods: {
       
        deleteItems(data) {
            this.$store.dispatch('VideoState/deleteVideos', data)
        },

        viewItem(item) {
            this.$router.push('/content/videos/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('VideoState/getVideos');
        }
    }
}
</script>

<style scoped>
</style>