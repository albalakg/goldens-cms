<template>
  <v-app id="app">

    <span v-if="logged">
      <Topbar />
      <Sidebar />
      <PrimaryMessage />
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
import PrimaryMessage from './components/Messages/PrimaryMessage.vue';

export default {
  components: {
    Sidebar,
    Topbar,
    PrimaryMessage
  },

  created() {
    this.setInitialSettings()
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
    setInitialSettings() {
      this.$store.dispatch('AppState/updateLogState', Auth.isLogged())
      // this.$store.dispatch('AppState/updateItemsPerPage', window.screen.width > 1600 ? 10 : 5)
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

  body {
    overflow-y: auto;
    height: 100vh;
    overflow-x: hidden;
  }

  .app_content {
    padding-top: 70px;
    margin-left: 7vw;
    width: 93vw;
    padding-right: 10px;
  }
  
  .app_content_mini {
    margin-left: 17vw;
    width: 83vw;
  }

  .app_content_full_screen {
    margin-left: 0;
    padding: 0;
  }

  #app {
    background-color: #0B032D11;
  }

  @media only screen and (max-width: 1700px) {
    .app_content_mini {
      margin-left: 20vw;
      width: 80vw;
    }
  }

  @media only screen and (max-width: 1400px) {
    .app_content_mini {
      margin-left: 22vw;
      width: 78vw;
    }
  }

</style>
