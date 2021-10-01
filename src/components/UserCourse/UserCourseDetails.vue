<template>
    <v-container fluid>
        <v-card class="pa-5">
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            User
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{user.full_name}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            Course
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{course.name}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            Price
                        </v-list-item-title>
                        <v-list-item-subtitle>{{userCourse.price}} ILS</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            Start time
                        </v-list-item-title>
                        <v-list-item-subtitle>{{userCourse.created_at}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            Expiration Date
                        </v-list-item-title>
                        <v-list-item-subtitle>{{userCourse.end_at}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            Status
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <StatusChip :status="userCourse.status" />
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>   
        </v-card>
    </v-container>
</template>

<script>
import StatusChip from './../Status/StatusChip.vue'

export default {
    components: {
        StatusChip,
    },
    
    props: {
        userCourse: {
            type: Object,
            required: true
        },
        user: {
            type: Object,
            required: true
        },
        course: {
            type: Object,
            required: true
        },
    },

    methods: {
       
    }
}
</script>

<style scoped>
</style>