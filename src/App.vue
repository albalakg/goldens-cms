<template>
  <v-app id="app">

    <span v-if="logged">
      <Topbar />
      <Sidebar />
    </span>
    
    <v-main>
      <transition name="fade" mode="out-in">
        <router-view
          class="app_content"
          :class="`
            ${sidebarIsOpen && logged ? 'app_content_mini' : ''}
            ${!logged ? 'app_content_full_screen' : ''}
          `"
        >
        </router-view>
      </transition>
    </v-main>

  </v-app>
</template>

<script>
import Sidebar from './components/Navigation/Sidebar/SidebarMain.vue';
import Topbar from './components/Navigation/Topbar/TopbarMain.vue';

export default {
  components: {
    Sidebar,
    Topbar
  },

  created() {
    this.setLoggedState()
  },

  computed: {
    sidebarIsOpen() {
      return this.$store.getters['AppState/sidebarState'];
    },

    logged() {
      return this.$store.getters['AppState/isLogged'];
    }
  },

  methods: {
    setLoggedState() {
      this.$store.dispatch('AppState/updateLogState', Auth.isLogged())
    }
  }

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

  .app_content {
    padding-top: 70px;
    margin-left: 7vw;
    width: 93vw;
    padding-right: 30px;
  }

  .app_content_mini {
    margin-left: 18vw;
    width: 82vw;
  }

  .app_content_full_screen {
    margin-left: 0;
    padding: 0;
  }
</style>
