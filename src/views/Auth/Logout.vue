<template>
</template>

<script>
export default {
    created() {
        this.$store.dispatch('AppState/updateLogState', false);
        axios.post('profile/logout');
        Auth.deleteCookie()
        this.$router.push('/login');
    }
}
</script>

<style scoped>
</style>