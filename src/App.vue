<template>
  <div id="app">

    <Topbar />
    <Sidebar />
    
    <v-main>
      <transition name="fade" mode="out-in">
        <router-view
          id="view"
        >
        </router-view>
      </transition>
    </v-main>

  </div>
</template>

<script>
import Sidebar from './components/Navigation/Sidebar/SidebarMain.vue';
import Topbar from './components/Navigation/Topbar/TopbarMain.vue';

export default {
  components: {
    Sidebar,
    Topbar
  },

  data() {
    return {

    }
  },

}
</script>

<style lang="scss">

  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 0.3s;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  html {
    overflow: hidden;
  }

</style>
