<template>
    <div class="pb-xl-5">

        <v-card class="pa-3 mb-6 search_wrapper" v-show="showFilterSection">
            <v-text-field
                v-if="searchable"
                dense
                label="Search..."
                v-model="search"
                outlined
            ></v-text-field>
            <v-flex 
                d-flex 
                :class="searchable ? 'mt-5' : ''" 
                v-if="filterStatus"
            >
                <v-select
                   
                    outlined
                    dense
                    item-value="value"
                    item-text="text"
                    :items="filterStatus"
                    v-model="pickedStatusFilters"
                    label="Filter by status"
                    small-chips
                    multiple
                ></v-select>
            </v-flex>
        </v-card>

        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            class="elevation-1"
            :show-select="multiple"
            pagination.sync="pagination"
            item-key="id"
            :items-per-page="itemsPerPage"
            :loading="loading"
            :search="search"
        >
            
            <template v-slot:item.actions="props">
                <v-flex d-flex justify-end>
                        <v-icon 
                            v-if="editable"
                            color="green"
                            class="mx-1"
                            title="Edit"
                            @click="actionEdit(props.item)"
                        >
                            mdi-playlist-edit
                        </v-icon>

                        <v-icon 
                            v-if="viewable"
                            color="blue"
                            class="mx-1"
                            title="View"
                            @click="actionView(props.item)"
                        >
                            mdi-file-find
                        </v-icon>

                        <span :title="props.item.deleteDisabledMessage ? props.item.deleteDisabledMessage : 'Delete'">
                            <v-icon 
                                v-if="deleteable"
                                color="red"
                                class="mx-1"
                                @click="actionDelete(props.item)"
                                :disabled="!!props.item.deleteDisabledMessage"
                            >
                                mdi-trash-can-outline
                            </v-icon>
                        </span>
                </v-flex>
            </template>

            <template v-slot:item.email="props">
                <a class="no_decoration" :href="`mailto:${props.item.email}`" title="Click to send an email">
                    {{props.item.email}}
                </a>
            </template>

            <template v-slot:item.full_name="props">
                <div v-if="props.item.user_id">
                    <router-link :to="`/users/show/${props.item.user_id}`">
                        {{props.item.full_name}}
                    </router-link>
                </div>
                <span v-else>
                    {{props.item.full_name}}
                </span>
            </template>

            <template v-slot:item.support_category="props">
                <div v-if="props.item.support_category_id">
                    <router-link :to="`/support/categories/show/${props.item.support_category_id}`">
                        {{props.item.support_category}}
                    </router-link>
                </div>
                <span v-else>
                    {{props.item.support_category}}
                </span>
            </template>

            <template v-slot:item.coupon_code="props">
                <div v-if="props.item.coupon_id">
                    <router-link :to="`/content/coupons/show/${props.item.coupon_id}`">
                        {{props.item.coupon_code}}
                    </router-link>
                </div>
                <span v-else>
                    {{props.item.coupon_code}}
                </span>
            </template>

            <template v-slot:item.category_name="props">
                <div v-if="props.item.category_id">
                    <router-link :to="`/content/course-categories/show/${props.item.category_id}`">
                        {{props.item.category_name}}
                    </router-link>
                </div>
                <span v-else>
                    {{props.item.category_name}}
                </span>
            </template>

            <template v-slot:item.course_name="props">
                <div v-if="props.item.course_id">
                    <router-link :to="`/content/courses/show/${props.item.course_id}`">
                        {{props.item.course_name}}
                    </router-link>
                </div>
                <span v-else>
                    {{props.item.course_name}}
                </span>
            </template>

            <template v-slot:item.course_lesson_name="props">
                <div v-if="props.item.course_lesson_id">
                    <router-link :to="`/content/lessons/show/${props.item.course_lesson_id}`">
                        {{props.item.course_lesson_name}}
                    </router-link>
                </div>
                <span v-else>
                    {{props.item.course_lesson_name}}
                </span>
            </template>

            <template v-slot:item.course_area_name="props">
                <div v-if="props.item.course_area_id">
                    <router-link :to="`/content/course-areas/show/${props.item.course_area_id}`">
                        {{props.item.course_area_name}}
                    </router-link>
                </div>
                <span v-else>
                    {{props.item.course_area_name}}
                </span>
            </template>

            <template v-slot:item.phone="props">
                <a class="no_decoration" :href="`tel:${props.item.phone}`" title="Click to call">
                    {{props.item.phone}}
                </a>
            </template>

            <template v-slot:item.trainer="props">
                <router-link v-if="props.item.trainer" :to="`/content/trainers/show/${props.item.trainer.id}`">
                    {{props.item.trainer.name}}
                </router-link>
                <span v-else>
                    לא ידוע
                </span>
            </template>

            <template v-slot:item.status="props">
                <StatusChip 
                    :customText="statusTexts"
                    :status="props.item.status"
                />
            </template>

            <template v-slot:item.video="props">
                <div>
                    <video class="table_video" controls :src="props.item.file ? URL.createObjectURL(props.item.file) : props.item.video"></video>
                </div>
            </template>

            <template v-slot:item.price="props">
                ₪
                {{
                    props.item.price ? props.item.price : 0
                }}
            </template>

            <template v-slot:item.discount="props">
                {{
                    props.item.discount ? props.item.discount : 0
                }}%
            </template>

            <template v-slot:item.discount_in_coins="props">
                ₪
                {{
                    props.item.discount ? props.item.discount : 0
                }}
            </template>

            <template v-slot:item.marketing_token="props">
                <a :href="`http://localhost:8083/#/orders?courseId=1&token=${props.item.token}`" target="_blank">
                    {{ `http://localhost:8083/#/orders?courseId=1&token=${props.item.token}` }}
                </a>
            </template>

            <template v-slot:item.created_at="props">
                {{
                    props.item.created_at ? props.item.created_at : "Unknown"
                }}
            </template>

        </v-data-table>

        <br>

        <v-card class="pa-3" v-if="multiple">
            <v-flex d-flex>
                <v-select
                    :items="multipleActionItems"
                    v-model="multipleActionPickedItem"
                    label="Action"
                    outlined
                    dense
                ></v-select>

                <span
                    :title="canActivateMultipleAction ? 'Activate multiple actions' : 'Need to select records and action'"
                >
                        <v-btn 
                        color="teal" 
                        height="39" 
                        class="ml-3" 
                        dark
                        @click="actionMultiple()"
                        :class="!canActivateMultipleAction ? 'disabled' : ''"
                        
                    >
                        Activate
                    </v-btn>
                </span>
            </v-flex>
        </v-card>

        <v-dialog
            v-model="dialog.state"
            max-width="500px"
            transition="dialog-transition"
            >

            <v-card class="pa-5">
                <v-card-title primary-title>
                    <v-icon
                        :color="dialog.icon.color"
                        class="mr-3"
                    >
                        {{dialog.icon.name}}
                    </v-icon>
                    {{dialog.title}}
                </v-card-title>

                <v-divider class="my-3 mx-5"></v-divider>

                <v-card-text>
                    {{dialog.text}}
                    <div v-if="mainField" class="deleted_items_wrapper">
                        <p class="mb-0" v-for="(item, index) in dialog.items" :key="index">

                            <strong :class="!!item.deleteDisabledMessage ? 'red--text' : ''">
                                {{index + 1}}. {{item[mainField]}} {{ !!item.deleteDisabledMessage ? ' - ' + item.deleteDisabledMessage : ''}}
                            </strong>
                        </p>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-btn
                        color="grey"
                        text
                        @click="dialog.state = false"
                        >Cancel</v-btn
                    >
                    <v-spacer></v-spacer>
                    <v-btn
                        color="teal"
                        dark
                        @click="dialogHandler()"
                        >Accept</v-btn
                    >
                </v-card-actions>
            </v-card>        

        </v-dialog>
    </div>
</template>

<script>
import StatusChip from './../Status/StatusChip.vue';

const DELETE_ACTION = 'delete';
const NO_ACTION = 'Choose an action';

export default {
    components: {
        StatusChip,
    },

    props: {
        loading: {
            type: Boolean
        },

        headers: {
            type: Array,
            required: true
        },

        items: {
            type: Array,
            required: true
        },

        searchable: {
            type: Boolean,
        },

        filterStatus: {
            type: Array
        },

        editable: {
            type: Boolean,
        },

        viewable: {
            type: Boolean,
        },

        deleteable: {
            type: Boolean,
        },

        mainField: {
            type: String,
        },

        multiple: {
            type: Boolean,
        },
    },

    data() {
        return {
            search: '',
            dialog: {
                action: '',
                state: false,
                text: '',
                title: '',
                icon: {
                    name: '',
                    color: ''
                },
                item: null,
                items: null,
            },
            domain: DOMAIN,
            selected: [],
            multipleActionPickedItem: NO_ACTION,
            pickedStatusFilters: this.filterStatus ? this.filterStatus.map(status => status) : [],
            FILES_PATH: FILES_PATH,
            URL: URL,
            cantDelete: null
        }
    },

    watch: {
        search() {
            this.actionSearch();
        },
        
        pickedStatusFilters: {
            deep: true,
            handler() {
                this.$emit('filterByStatus', this.pickedStatusFilters);
            }
        }
    },

    computed: {
        multipleActionItems() {
            const items = [NO_ACTION];
            if(this.deleteable) {
                items.push('Delete')
            }

            return items;
        },

        itemsPerPage() {
            return this.$store.getters['AppState/itemsPerPage'];
        },

        canActivateMultipleAction() {
            return this.multipleActionPickedItem && this.multipleActionPickedItem !== NO_ACTION && this.selected.length;
        },

        showFilterSection() {
            return this.searchable || this.filterStatus
        },

        statusTexts() {
            return this.filterStatus.map(item => item.text);
        },

    },

    methods: {
        actionEdit(item) {
            this.$emit('edit', item)
        },
        
        actionView(item) {
            this.$emit('view', item)
        },

        actionSearch() {
            this.$emit('search', this.search)
        },

        actionMultiple() {
            if(this.multipleActionPickedItem === 'Delete') {
                this.multipleActionDelete()
            }
        },

        actionDelete(item) {
            try {
                this.resetDialogState();

                this.dialog.state       = true;
                this.dialog.item        = item;
                this.dialog.action      = DELETE_ACTION;
                this.dialog.title       = `Delete ${this.mainField ? item[this.mainField] : 'record'}`;
                this.dialog.text        = `Are you sure you want to delete ${this.mainField ? item[this.mainField] : 'this record'}?`
                this.dialog.icon.name   = 'mdi-trash-can-outline';
                this.dialog.icon.color  = 'red';
            } catch(err) {
                console.warn('actionDelete: ' + err);
                this.dialogActionFailed('Sorry, failed to delete the record');
            }
        },

        multipleActionDelete() {
            try {
                this.resetDialogState();

                this.cantDelete = this.selected.find(item => !!item.deleteDisabledMessage);
                
                this.dialog.state       = true;
                this.dialog.items       = this.selected;
                this.dialog.action      = DELETE_ACTION;
                this.dialog.title       = `Delete multiple records`;
                if(this.cantDelete) {
                    this.dialog.text        = `Cannot delete these items because:`;
                } else {
                    this.dialog.text        = `Are you sure you want to delete ${this.mainField ? `these ${this.dialog.items.length} records:` : 'the selected records?'}`;
                }
                this.dialog.icon.name   = 'mdi-trash-can-outline';
                this.dialog.icon.color  = 'red';
            } catch(err) {
                console.warn('multipleActionDelete: ' + err);
                this.dialogActionFailed('Sorry, failed to delete the selected records');
            }
        },

        dialogActionFailed(text) {
            this.resetDialogState();
            this.$store.dispatch('MessageState/addMessage', {
                message: text,
                type: 'error',
                time: 50000
            });
        },

        resetDialogState() {
            this.dialog = {...{
                action: '',
                state: false,
                text: '',
                title: '',
                icon: {
                    name: '',
                    color: ''
                },
                item: null,
                items: null
            }};
        },

        dialogHandler() {
            if(this.cantDelete) {
                return this.resetDialogState();
            }

            this.$emit(
                this.dialog.action, 
                this.dialog.items ? this.dialog.items.map(item => item.id) : [this.dialog.item.id]
            );
            this.resetDialogState();
            this.selected = [];
        }
    }
}
</script>

<style scoped>

    ::v-deep .v-input {
        height: 40px;
    }

    .deleted_items_wrapper {
        max-height: 100px;
        overflow-y: auto;
    }

</style>