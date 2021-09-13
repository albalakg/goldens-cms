<template>
    <div>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {

    created() {
        this.$store.dispatch('UserState/getUsers');
    },

    computed: {
        users() {
            return this.$store.getters['UserState/users'];
        },

        usersKey() {
            return JSON.stringify(this.$store.getters['UserState/users'])
        }
    }

}
</script>

<style scoped>
</style>