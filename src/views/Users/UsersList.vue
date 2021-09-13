<template>
    <v-container fluid>
        <TopCard 
            text="Users"
        />

        <br>

        <TableCard
            :headers="headers"
            :items="users"
            :loading="loadingUsers"
            :filerStatus="statuses"
            viewable
            deleteable
            searchable
            multipleEdit
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
                { text: 'Name', value: 'full_name' },
                { text: 'Email', value: 'email' },
                { text: 'Phone', value: 'phone' },
                { text: 'Status', value: 'status' },
                { text: 'Created At', value: 'created_at' },
                { text: 'Actions', value: 'actions', align: 'right' },
            ],
            search: '',
            statuses: STATUSES_SELECTION,
            filterStatuses: STATUSES_VALUES
        }
    },

    computed: {
        users() {
            let users = this.$store.getters['UserState/users'];
            console.log('users', users);

            if(!users) {
                return [];
            }

            // filter by status
            users = users.data.filter(user => this.filterStatuses.includes(user.status))

            return users;
        },

        loadingUsers() {
            return !this.$store.getters['UserState/users'];
        }
    },

    methods: {
       
        deleteItem(data) {
            console.log('deleteItem', data);
            this.$store.dispatch('UserState/deleteUsers', data)
        },

        viewItem(item) {
            console.log('viewItem: ', item);
            this.$router.push('/users/show/' + item.id)
        },

        filterByStatus(statuses) {
            console.log('filterByStatus', statuses);
            this.filterStatuses = statuses;
        }
    }
}
</script>

<style scoped>
</style>