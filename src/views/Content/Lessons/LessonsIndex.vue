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
        this.$store.dispatch('LessonState/getLessons');
    },

}
</script>

<style scoped>
</style>