<template>
    <div class="pb-xl-5">

        <v-card class="pa-3 search_wrapper">
            <v-text-field
                dense
                label="Search..."
                v-model="search"
                outlined
            ></v-text-field>
        </v-card>

        <br>

        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            class="elevation-1"
            :show-select="multipleEdit"
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
                            v-if="deleteable"
                            color="red"
                            class="mx-1"
                            title="Delete"
                            @click="actionDelete(props.item)"
                        >
                            mdi-trash-can-outline
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
                </v-flex>
            </template>

            <template v-slot:item.status="props">
                <StatusChip 
                    :status="props.item.status"
                />
            </template>

        </v-data-table>

        <br>

        <v-card class="pa-3" v-if="multipleEdit">
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

                            <strong>
                                {{index + 1}}. {{item[mainField]}}
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

        multipleEdit: {
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
            selected: [],
            multipleActionPickedItem: ''
        }
    },

    watch: {
        search() {
            this.actionSearch();
        }
    },

    computed: {
        multipleActionItems() {
            const items = [];
            if(this.deleteable) {
                items.push('Delete')
            }

            return items;
        },

        itemsPerPage() {
            return this.$store.getters['AppState/itemsPerPage'];
        },

        canActivateMultipleAction() {
            return this.multipleActionPickedItem && this.selected.length;
        }
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
                console.warn('multipleActionDelete: ' + err);
                this.dialogActionFailed('Sorry, failed to delete the record');
            }
        },

        multipleActionDelete() {
            try {
                this.resetDialogState();

                this.dialog.state       = true;
                this.dialog.items       = this.selected;
                this.dialog.action      = DELETE_ACTION;
                this.dialog.title       = `Delete multiple records`;
                this.dialog.text        = `Are you sure you want to delete ${this.mainField ? 'these records:' : 'the selected records?'}`;
                this.dialog.icon.name   = 'mdi-trash-can-outline';
                this.dialog.icon.color  = 'red';
            } catch(err) {
                console.warn('multipleActionDelete: ' + err);
                this.dialogActionFailed('Sorry, failed to delete the selected records');
            }
        },

        dialogActionFailed(text) {
            this.resetDialogState();
            this.$store.dispatch('MessageState/showMessage', {
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
            console.log('dialogHandler', this.dialog.action);
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