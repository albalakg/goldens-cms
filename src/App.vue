<template>
  <v-app id="app">

    <span v-if="logged">
      <Topbar />
      <Sidebar />
      <PrimaryMessage />
      <!-- <Breadcrumbs 
        class="breadcrumbs"
        :class="`
          ${sidebarIsOpen && logged ? 'app_content_mini' : ''}
          ${!logged ? 'app_content_full_screen' : ''}
        `"
        :items="breadcrumbs"
      /> -->
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
import Breadcrumbs from './components/Navigation/Topbar/Breadcrumbs.vue';
import PrimaryMessage from './components/Messages/PrimaryMessage.vue';

export default {
  components: {
    Sidebar,
    Topbar,
    Breadcrumbs,
    PrimaryMessage
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
    },

    breadcrumbs() {
      return [
        {
          text: 'Dashboard',
          disabled: false,
          href: 'breadcrumbs_dashboard',
        },
        {
          text: 'Link 1',
          disabled: false,
          href: 'breadcrumbs_link_1',
        },
        {
          text: 'Link 2',
          disabled: true,
          href: 'breadcrumbs_link_2',
        },
      ]
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
  
  .breadcrumbs {
    padding-top: 70px;
    margin-left: 7vw;
    width: 93vw;
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
