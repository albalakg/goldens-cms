<template>
    <v-flex d-flex class="schedule_reorder_card">
        <v-flex md4 class="pr-2">
            <FormCard
                title="Lessons list"
            >
                <template slot="content">
                    <v-flex d-flex align-center justify-space-between class="mb-2">
                        <v-flex xs7>
                            <v-text-field
                                dense
                                label="Search a lesson..."
                                v-model="search"
                                outlined
                                hide-details
                            >
                            </v-text-field>
                        </v-flex>
                        <v-switch
                            v-model="filterByDate"
                            label="Missing date"
                            hide-details
                            class="mt-0"
                        ></v-switch>
                    </v-flex>
                    <div class="mb-2">
                        <small>
                            Lessons with dates: {{ totalLessonsWithDate + '/' + totalLessons }}
                        </small>
                    </div>
                    <div class="lesson_list_wrapper">
                        <lesson-schedule-card 
                            v-for="lesson in lessons" 
                            :key="lesson.id"
                            :schedule="getScheduleByLessonId(lesson.id)"
                            :lesson="lesson"
                            @save="saveDate"
                        />
                    </div>
                    <SubmitButton
                        class="mt-3 mb-2"
                        :loading="loading"
                        :disabled="!canSubmit"
                        @submit="submit()"
                    />
                </template>
            </FormCard>
        </v-flex>
        <v-flex md8 class="pl-2">
            <form-card
                title="Course Schedule"
                createable
                @add="toggleTrainingSchedule()"
            >
                <template slot="content">
                    <v-sheet height="64">
                        <v-toolbar
                            flat
                            >
                            <v-btn
                                outlined
                                class="mr-4"
                                color="grey darken-2"
                                @click="setToday"
                            >
                                Today
                            </v-btn>
                            <v-btn
                                fab
                                text
                                small
                                color="grey darken-2"
                                @click="prev"
                            >
                                <v-icon small>
                                mdi-chevron-left
                                </v-icon>
                            </v-btn>
                            <v-btn
                                fab
                                text
                                small
                                color="grey darken-2"
                                @click="next"
                            >
                                <v-icon small>
                                mdi-chevron-right
                                </v-icon>
                            </v-btn>
                            <v-toolbar-title v-if="$refs.calendar">
                                {{ $refs.calendar.title }}
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-menu
                                bottom
                                right
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    outlined
                                    color="grey darken-2"
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    <span>{{ typeToLabel[type] }}</span>
                                    <v-icon right>
                                    mdi-menu-down
                                    </v-icon>
                                </v-btn>
                                </template>
                                <v-list>
                                <v-list-item @click="type = 'day'">
                                    <v-list-item-title>Day</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="type = 'month'">
                                    <v-list-item-title>Month</v-list-item-title>
                                </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-toolbar>
                    </v-sheet>
                    <v-sheet height="600">
                        <v-calendar
                            ref="calendar"
                            v-model="focus"
                            color="primary"
                            :events="events"
                            :event-color="getEventColor"
                            :type="type"
                            @click:event="showEvent"
                            @click:more="viewDay"
                            @click:date="viewDay"
                            @change="updateRange"
                        >
                        </v-calendar>
                        <v-menu
                            v-model="selectedOpen"
                            :close-on-content-click="false"
                            :activator="selectedElement"
                            offset-x
                        >
                            <v-card
                                color="grey lighten-4"
                                min-width="350px"
                                flat
                            >
                                <v-toolbar
                                    :color="selectedEvent.color"
                                    dark
                                    >
                                    
                                    <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-icon @click="selectedOpen = false">mdi-close</v-icon>
                                </v-toolbar>
                                <v-card-text>
                                    <h2 class="mb-3">
                                        {{ types[selectedEvent.type_id] }}
                                    </h2>
                                    <v-date-picker
                                        :color="selectedEvent.color"
                                        v-model="selectedEvent.dateOnly"
                                        class="w100"
                                    >
                                    </v-date-picker>
                                    <SubmitButton
                                        class="mt-3 mb-2"
                                        @submit="saveDateFromCalendar(selectedEvent)"
                                        :disabled="isSameDay(selectedEvent.dateOnly, selectedEvent.start)"
                                    />
                                    <!-- <br>
                                    <SubmitButton
                                        class="mt-3 mb-2"
                                        @submit="deleteTrainingSchedule()"
                                    /> -->
                                </v-card-text>
                                <v-card-actions>
                                
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                    </v-sheet>
                </template>
            </form-card>
        </v-flex>
        <v-dialog
            v-model="trainingDialog"
            scrollable 
            :overlay="false"
            max-width="500px"
            transition="dialog-transition"
        >
            <v-card class="pa-5">
                <v-form ref="form" @submit.prevent="submit()">
                    <h2>
                        Add a training schedule for a lesson
                    </h2>
                    <br>
                    <v-autocomplete
                        outlined
                        :items="lessons"
                        v-model="newTrainingScheduleForm.course_lesson_id"
                        label="Lessons"
                        item-value="id"
                        item-text="name"
                    ></v-autocomplete>
                    <br>
                    <v-date-picker class="w100" v-model="newTrainingScheduleForm.date" color="#0e3556"></v-date-picker>
                    <br>
                    <v-flex md8 mx-auto class="mt-4">
                        <SubmitButton 
                            @submit="addTrainingSchedule()"
                            :disabled="!canSubmitTrainingSchedule"
                        />
                    </v-flex>
                    <br>
                </v-form>
            </v-card>
        </v-dialog>
    </v-flex>
</template>

<script>
import FormCard from '../../components/Cards/FormCard.vue'
import SubmitButton from '../Buttons/SubmitButton.vue';
import LessonScheduleCard from '../Cards/LessonScheduleCard.vue';
import { SCHEDULE_LESSON_TYPE_ID, SCHEDULE_TRAINING_TYPE_ID } from '../../helpers/Content';

export default {
    components: {
        FormCard,
        LessonScheduleCard,
        SubmitButton,
    },

    props: {
        course: {
            type: Object,
            required: true
        }
    },
    
    data() {
        return {
            refreshKey: 1,
            loading: false,
            search: '',
            filterByDate: '',
            focus: new Date('2023-01-01'),
            type: 'month',
            events: [],
            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            typeToLabel: {
                month: 'Month',
                day: 'Day'
            },
            scheduleColors: {
                1: 'blue',
                2: 'indigo',
                3: 'deep-purple',
                4: 'cyan',
                5: 'green',
                6: 'orange',
            },
            trainingDialog: false,
            newTrainingScheduleForm: {
                course_lesson_id: '',
                date: ''
            },
            types: {
                [SCHEDULE_LESSON_TYPE_ID]: 'Lesson', 
                [SCHEDULE_TRAINING_TYPE_ID]: 'Training', 
            }
        }
    },

    mounted() {
        setTimeout(() => {
            this.updateRange();
            this.focusFirstEventDate();
        }, 1000);
    },

    computed: {
        lessons() {
            if(!this.$store.getters['LessonState/lessons']) {
                return [];
            }

            this.refreshKey;
            let lessons = this.$store.getters['LessonState/lessons'].filter(lesson => lesson.course_id === this.course.id);
            if(!lessons) {
                return [];
            }
            
            lessons = lessons.filter(lesson => {
                if(lesson.course_id !== this.course.id) {
                    return null;
                }

                if(!lesson.name.toLowerCase().includes(this.search.toLowerCase())) {
                    return null;
                }

                if(this.filterByDate && (lesson.tempDate || lesson.schedule?.date)) {
                    return null;
                }

                return lesson;
            });

            function compare( a, b ) {
                if(a.tempDate) {
                    if ( new Date(a.tempDate) < new Date(b.tempDate) ){
                        return -1;
                    }
                    if ( new Date(a.tempDate) > new Date(b.tempDate) ){
                        return 1;
                    }
                } else {
                    const dateA = a.schedule ? a.schedule.date : '';
                    const dateB = b.schedule ? b.schedule.date : '';
                    if ( new Date(dateA) < new Date(dateB) ){
                        return -1;
                    }
                    if ( new Date(dateA) > new Date(dateB) ){
                        return 1;
                    }
                }
                return 0;
            }

            lessons = lessons.map(lesson => {
                const schedule = this.course.schedules.find(schedule => {
                    return schedule.course_lesson_id === lesson.id;
                });
                
                if(schedule) {
                    lesson.scheduleId = schedule.id;
                }

                return lesson;
            })

            return lessons.sort( compare );
        },

        totalLessons() {
            if(!this.$store.getters['LessonState/lessons']) {
                return;
            }

            const lessons = this.$store.getters['LessonState/lessons'].filter(lesson => lesson.course_id === this.course.id);
            return lessons ? lessons.length : 0;
        },

        totalLessonsWithDate() {
            const course = this.$store.getters['CourseState/courses'].find(course => course.id === this.course.id);
            if(!course) {
                return 0;
            }

            return course.schedules.length;
        },

        nowY () {
            return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
        },

        canSubmit() {
            return this.totalLessons && this.totalLessons <= this.totalLessonsWithDate;
        },

        canSubmitTrainingSchedule() {
            return (!!this.newTrainingScheduleForm.date && !!this.newTrainingScheduleForm.course_lesson_id);
        }
    },

    methods: {
        toggleTrainingSchedule() {
            this.trainingDialog = !this.trainingDialog;
        },

        addTrainingSchedule() {
            const lesson = this.lessons.find(lesson => lesson.id === this.newTrainingScheduleForm.course_lesson_id);
            this.$store.dispatch('CourseState/setTrainingSchedule', {
                id:                 this.getNewEventId(),
                courseId:           this.course.id,
                course_lesson_id:   lesson.id,
                course_area_id:     lesson.course_area_id, 
                date:               this.newTrainingScheduleForm.date, 
                name:               lesson.name,
                type_id:            SCHEDULE_TRAINING_TYPE_ID
            });

            this.trainingScheduleIsUpdated();
        },

        deleteTrainingSchedule() {
            const lesson = this.lessons.find(lesson => lesson.id === this.newTrainingScheduleForm.course_lesson_id);
            this.$store.dispatch('CourseState/setTrainingSchedule', {
                courseId:           this.course.id,
                course_lesson_id:   lesson.id,
                course_area_id:     lesson.course_area_id, 
                date:               this.newTrainingScheduleForm.date, 
                name:               lesson.name,
                type_id:            SCHEDULE_TRAINING_TYPE_ID
            });
            this.trainingScheduleIsUpdated();
        },

        trainingScheduleIsUpdated() {
            this.setDateFocus(new Date(this.newTrainingScheduleForm.date))
            this.resetTrainingScheduleForm();
            this.toggleTrainingSchedule();
            this.updateRange();
        },

        resetTrainingScheduleForm() {
            this.newTrainingScheduleForm = {
                course_lesson_id: '',
                date: ''
            };
        },

        async submit() {
            this.loading = true;

            const lessons = this.$store.getters['LessonState/lessons'].filter(lesson => lesson.course_id === this.course.id);
            const course = this.$store.getters['CourseState/courses'].find(course => course.id === this.course.id);
        
            const data = {
                id: lessons[0].course_id,
                lessonsId: course.schedules.map(schedule => {
                    return {
                        id: schedule.course_lesson_id,
                        date: schedule.date,
                        type_id: schedule.type_id
                    }
                })
            };

            await this.$store.dispatch('CourseState/saveCourseSchedule', data);
            this.loading = false;
        },

        viewDay ({ date }) {
            this.setDateFocus(date)
            this.type = 'day'
        },

        getEventColor (event) {
            return event.color
        },

        setToday () {
            this.setDateFocus('')
        },

        setDateFocus(date) {
            this.focus = date;
        },

        focusFirstEventDate() {
            let earliestDate = new Date();

            this.events.forEach(event => {
                const eventDate = new Date(event.dateOnly);
                if(eventDate < earliestDate) {
                    earliestDate = eventDate;
                }
            })

            this.focus = earliestDate;
        },

        prev () {
            this.$refs.calendar.prev()
        },

        next () {
            this.$refs.calendar.next()
        },

        showEvent ({ nativeEvent, event }) {
            const open = () => {
                this.selectedEvent = event
                this.selectedElement = nativeEvent.target
                requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
            }

            if (this.selectedOpen) {
                this.selectedOpen = false
                requestAnimationFrame(() => requestAnimationFrame(() => open()))
            } else {
                open()
            }

            nativeEvent.stopPropagation()
        },

        updateRange () {
            const events = [];

            if(!this.course.schedules.length || !this.$store.getters['LessonState/lessons']) {
                return;
            }

            const lessons = this.$store.getters['LessonState/lessons'].filter(lesson => lesson.course_id === this.course.id);
            this.course.schedules.forEach(schedule => {
                const date      = schedule.tempDate ?? schedule.date;
                const year      = new Date(date).getFullYear();
                const lesson    = lessons.find(lesson => lesson.id === schedule.course_lesson_id);
                if(!lesson) {
                    return;
                }
                let month       = new Date(date).getMonth() + 1;
                month           = String(month).length === 1 ? '0' + month : month;
                let day         = new Date(date).getDate();
                day             = String(day).length === 1 ? '0' + day : day;
                events.push({
                    scheduleId:         schedule.id,
                    course_lesson_id:   schedule.course_lesson_id,
                    course_area_id:     lesson.course_area_id,
                    type_id:            schedule.type_id,
                    name:               lesson ? lesson.name : '',
                    color:              schedule.type_id === SCHEDULE_TRAINING_TYPE_ID ? this.scheduleColors[6] :this.scheduleColors[lesson.course_area_id],
                    start:              schedule.date ?? new Date(date),
                    end:                schedule.date ?? new Date(date),
                    dateOnly:           year + '-' + month + '-' + day,
                    allDay:             true,
                });
            })

            this.events = events
        },

        rnd (a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },

        getScheduleByLessonId(lessonId) {
            return this.course.schedules.find(schedule => schedule.course_lesson_id === lessonId && schedule.type_id === SCHEDULE_LESSON_TYPE_ID) ?? {};
        },

        saveDate(lessonData) {
            this.$store.dispatch('CourseState/setLessonSchedule', {courseId: this.course.id, ...lessonData, id: lessonData.id ?? this.getNewEventId()});
            this.updateRange();
            this.focus = new Date(lessonData.date)
        },

        saveDateFromCalendar(event) {
            const lessonData = {
                id:                 event.scheduleId ?? this.getNewEventId(),
                course_lesson_id:   event.course_lesson_id,
                course_area_id:     event.course_area_id,
                date:               event.dateOnly,
                type_id:            event.type_id
            };
            this.$store.dispatch('CourseState/setLessonSchedule', {courseId: this.course.id, ...lessonData});
            this.updateRange();
            this.setDateFocus(new Date(lessonData.date))
            this.selectedOpen = false;
            this.refreshKey++;
        },

        isSameDay(firstDay, secondDay) {
            firstDay  = new Date(firstDay);
            secondDay = new Date(secondDay);

            return  firstDay.getFullYear() === secondDay.getFullYear() &&
                    firstDay.getMonth() === secondDay.getMonth() &&
                    firstDay.getDate() === secondDay.getDate();
        },

        getNewEventId() {
            const heightCurrentID = Math.max(...this.course.schedules.map(schedule => schedule.id));
            return heightCurrentID > 0 ? heightCurrentID + 1 : 1;
        }
    }
}
</script>

<style scoped>

    .schedule_reorder_card > div{
        width: 100%;
    }

    .lesson_list_wrapper {
        max-height: 55vh;
        overflow-y: auto;
    }

</style>