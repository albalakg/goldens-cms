<template>
    <v-container fluid>
        <TopCard 
            text="Users"
            createable
            @reload="reload()"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="users"
            :loading="loadingUsers"
            :filterStatus="statuses"
            viewable
            deleteable
            searchable
            multiple
            mainField="full_name"
            @delete="deleteItem"
            @view="viewItem"
            @filterByStatus="filterByStatus"
        />
    </v-container>
</template>

<script>
import TopCard from './../../components/Cards/TopCard.vue'
import TableCard from './../../components/Cards/TableCard.vue'
import { STATUSES_SELECTION, STATUSES_VALUES } from './../../helpers/Status'

export default {
    components: {
        TopCard,
        TableCard
    },

    data() {
        return {
            headers: [
                { text: 'Name',         value: 'full_name' },
                { text: 'Email',        value: 'email' },
                { text: 'Phone',        value: 'phone' },
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
        users() {
            let users = this.$store.getters['UserState/users'];

            if(!users) {
                return [];
            }

            // filter by status
            users = users.filter(user => this.filterStatuses.includes(user.status))

            return users;
        },

        loadingUsers() {
            return !this.$store.getters['UserState/users'];
        }
    },

    methods: {
       
        deleteItem(data) {
            this.$store.dispatch('UserState/deleteUsers', data)
        },

        viewItem(item) {
            this.$router.push('/users/show/' + item.id)
        },

        filterByStatus(statuses) {
            this.filterStatuses = statuses;
        },

        reload() {
            this.$store.dispatch('UserState/getUsers');
        }
    }
}
</script>

<style scoped>
</style>