<template>
    <v-flex d-flex justify-space-between class="lesson_schedule_card">
        <div>
            <span v-if="!editMode">
                {{ lesson.name }}
            </span>
            <br>
            <small v-if="!editMode" class="mt-1">
                {{ courseAreaName }}
            </small>
        </div>
        <div class="mt-1">
            <v-flex d-flex align-center v-if="!editMode">
                <small class="mt-1">
                    {{  date }}
                </small>
                <v-btn class="ml-2" color="teal" dark fab small title="Set a date for the lesson" @click="toggleEditMode()">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </v-flex>
            <v-flex d-flex align-center v-else>
                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="newDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            dense
                            label="Lesson date"
                            v-model="newDate"
                            outlined
                            hide-details
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="newDate"
                        no-title
                        scrollable
                    >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="menu = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(newDate)"
                        >
                            OK
                        </v-btn>
                    </v-date-picker>
                </v-menu>
                <v-btn class="ml-2" fab small title="Cancel the editing" @click="cancel()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-btn class="ml-2" color="teal" dark fab small title="Save the date for the lesson" @click="save()">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </v-flex>
        </div>
    </v-flex>
</template>

<script>


export default {
    props: {
        lesson: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            menu: false,
            editMode: false,
            newDate: ''
        }
    },

    computed: {
        date() {
            if(this.lesson.tempDate) {
                return this.lesson.tempDate;
            }
            
            if(this.lesson.schedule && this.lesson.schedule.date) {
                return this.lesson.schedule.date;
            }

            return '';
        },

        courseAreaName() {
            const courseAreas = this.$store.getters['CourseAreaState/courseAreas'];
            if(!courseAreas) {
                return '';
            }
            const courseArea = courseAreas.find(courseArea => courseArea.id === this.lesson.course_area_id);
            return courseArea ? courseArea.name : '';
        },
    },

    methods: {
        toggleEditMode() {
            this.newDate    = this.date;
            this.editMode   = !this.editMode;
        },

        cancel() {
            this.newDate = '';
            this.toggleEditMode();
        },

        save() {
            this.$emit('save', {id: this.lesson.id, date: this.newDate});
            this.toggleEditMode();
        },
    }
}
</script>

<style scoped>

    .lesson_schedule_card {
        background-color: #fff;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #555;
        margin-bottom: 5px;
        width: calc(100% - 5px);
    }

</style>