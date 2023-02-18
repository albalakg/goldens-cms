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
                                    <span v-html="selectedEvent.details"></span>
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
                                </v-card-text>
                                <v-card-actions>
                                
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                    </v-sheet>
                </template>
            </form-card>
        </v-flex>
    </v-flex>
</template>

<script>
import FormCard from '../../components/Cards/FormCard.vue'
import SubmitButton from '../Buttons/SubmitButton.vue';
import LessonScheduleCard from '../Cards/LessonScheduleCard.vue';

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
            loading: false,
            test: '',
            search: '',
            filterByDate: '',
            focus: new Date('2023-01-01'),
            type: 'month',
            events: [],
            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
            typeToLabel: {
                month: 'Month',
                day: 'Day'
            },
            courseAreaColors: {
                1: 'blue',
                2: 'indigo',
                3: 'deep-purple',
                4: 'cyan',
                5: 'green',
                6: 'orange',
            }
        }
    },

    mounted() {
        setTimeout(() => {
            this.updateRange();
        }, 1000);
    },

    computed: {
        lessons() {
            const lessons = this.$store.getters['LessonState/lessons'];
            if(!lessons) {
                return [];
            }
            
            return lessons.filter(lesson => {
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
            })
        },

        totalLessons() {
            const lessons = this.$store.getters['LessonState/lessons'];
            return lessons ? lessons.length : 0;
        },

        totalLessonsWithDate() {
            const lessons = this.$store.getters['LessonState/lessons'];
            if(!lessons) {
                return 0
            }

            return lessons.filter(lesson => (lesson.tempDate || lesson.schedule?.date)).length
        },

        nowY () {
            return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
        },

        canSubmit() {
            const lessons           = this.$store.getters['LessonState/lessons']
            const hasLessons        = lessons && lessons.length;
            if(!hasLessons) {
                return false;
            }

            const allLessonsHasDate = lessons.filter(lesson => (lesson.schedule?.date || lesson.tempDate)).length === lessons.length
            if(!allLessonsHasDate) {
                return false;
            }

            return true;
        }
    },

    methods: {
        async submit() {
            this.loading = true;

            const lessons = this.$store.getters['LessonState/lessons'];
            const data = {
                id: lessons[0].course_id,
                lessonsId: lessons.map(lesson => {
                    return {
                        id: lesson.id,
                        date: lesson.tempDate ? lesson.tempDate : lesson.schedule?.date
                    }
                })
            };
            await this.$store.dispatch('CourseState/saveCourseSchedule', data);
            this.loading = false;
        },

        viewDay ({ date }) {
            this.focus = date
            this.type = 'day'
        },

        getEventColor (event) {
            return event.color
        },

        setToday () {
            this.focus = ''
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

            const lessons = this.$store.getters['LessonState/lessons'];
            if(!lessons) {
                return;
            }

            lessons.forEach(lesson => {
                let date = lesson.schedule ? lesson.schedule.date : '';
                if(lesson && lesson.tempDate) {
                    date = lesson.tempDate;
                }
                
                if(!date) {
                    return;
                }

                const year  = new Date(date).getFullYear();
                let month   = new Date(date).getMonth() + 1;
                month       = String(month).length === 1 ? '0' + month : month;
                let day     = new Date(date).getDate();
                day         = String(day).length === 1 ? '0' + day : day;
                
                events.push({
                    lessonId:   lesson.id,
                    name:       lesson.name,
                    color:      this.courseAreaColors[lesson.course_area_id],
                    start:      new Date(date),
                    end:        new Date(date),
                    dateOnly:   year + '-' + month + '-' + day,
                    allDay:     true
                });
            })

            this.events = events
        },

        rnd (a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },

        saveDate(lessonData) {
            this.$store.dispatch('LessonState/setTempDate', lessonData);
            this.updateRange({});
            this.focus = new Date(lessonData.date)
        },

        saveDateFromCalendar(event) {
            const lessonData = {
                id:     event.lessonId,
                date:   event.dateOnly
            };
            this.$store.dispatch('LessonState/setTempDate', lessonData);
            this.updateRange({});
            this.focus = new Date(lessonData.date)
            this.selectedOpen = false
        },

        isSameDay(firstDay, secondDay) {
            firstDay  = new Date(firstDay);
            secondDay = new Date(secondDay);

            return  firstDay.getFullYear() === secondDay.getFullYear() &&
                    firstDay.getMonth() === secondDay.getMonth() &&
                    firstDay.getDate() === secondDay.getDate();
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