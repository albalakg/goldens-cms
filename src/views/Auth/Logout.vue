<template>
</template>

<script>
import axios from "axios";

export default {
    created() {
        Auth.deleteCookie()
        this.$store.dispatch('AppState/updateLogState', false);
        axios.post('profile/logout');
        this.$router.push('/login');
    }
}
</script>

<style scoped>
</style>