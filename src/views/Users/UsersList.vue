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
            editable
            viewable
            deleteable
            searchable
            multipleEdit
            mainField="full_name"
            @edit="editItem"
            @delete="deleteItem"
            @view="viewItem"
        />
    </v-container>
</template>

<script>
import TopCard from './../../components/Cards/TopCard.vue'
import TableCard from './../../components/Cards/TableCard.vue'

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
            search: ''
        }
    },

    computed: {
        users() {
            if(!this.$store.getters['UserState/users']) {
                return [];
            }

            return this.$store.getters['UserState/users'].data.map(user => {
                const data = user;
                data.full_name = user.first_name + ' ' + user.last_name;
                return data; 
            })
        },

        loadingUsers() {
            return !this.$store.getters['UserState/users'];
        }
    },

    created() {
        this.$store.dispatch('UserState/getUsers')
    },

    methods: {
        editItem(item) {
            console.log('editItem: ', item);
        },

        deleteItem(data) {
            console.log('deleteItem', data);
            this.$store.dispatch('UserState/deleteUsers', data)
        },

        viewItem(item) {
            console.log('viewItem: ', item);
        },

    }
}
</script>

<style scoped>
</style>