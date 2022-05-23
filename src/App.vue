<template>
  <v-app id="app">
    <span v-if="isLogged">
      <Topbar />
      <Sidebar />
      <PrimaryMessage />
    </span>
    
    <v-main>
      <template v-if="loading">
        <v-flex class="loading_app" d-flex flex-wrap>
          <template v-for="item in 3">
            <v-sheet
              :key="item"
              color="lighten-4"
              class="pa-3 mx-1 skeleton"
            >
              <v-skeleton-loader
                class="mx-auto"
                max-width="800"
                type="card"
              ></v-skeleton-loader>
            </v-sheet>
          </template>
        </v-flex>
      </template>
      <template v-else>
        <SearchCard />
        <transition name="fade" mode="out-in">
          <router-view
            :key="$route.path"
            class="app_content app_animation"
            :class="`
              ${sidebarIsOpen && isLogged ? 'app_content_mini' : ''}
              ${!isLogged ? 'app_content_full_screen' : ''}
            `"
          >
          </router-view>
        </transition>
      </template>
    </v-main>

  </v-app>
</template>

<script>
import Sidebar from './components/Navigation/Sidebar/SidebarMain.vue';
import Topbar from './components/Navigation/Topbar/TopbarMain.vue';
import PrimaryMessage from './components/Messages/PrimaryMessage.vue';
import SearchCard from './components/Navigation/Topbar/SearchCard.vue';

export default {
  components: {
    Sidebar,
    Topbar,
    PrimaryMessage,
    SearchCard
  },

  data() {
    return {
      loading: true
    }
  },

  created() {
    if(Auth.isLogged()) {
      this.$store.dispatch('AppState/updateLogState', true);
    }
  },

  watch: {
    isLogged() {
      if(this.isLogged) {
        this.setInitialSettings();
      }
    }
  },

  computed: {
    sidebarIsOpen() {
      return this.$store.getters['AppState/sidebarState'];
    },

    isLogged() {
      return this.$store.getters['AppState/isLogged'];
    }
  },

  methods: {
    async setInitialSettings() {
      await this.fetchAppData();
      this.loading = false;
    },

    async fetchAppData() {
      return await Promise.allSettled([
        this.$store.dispatch('UserState/getUsers'),
        this.$store.dispatch('CourseState/getCourses'),
        this.$store.dispatch('CourseCategoryState/getCourseCategories'),
        this.$store.dispatch('LessonState/getLessons'),
        this.$store.dispatch('VideoState/getVideos'),
        this.$store.dispatch('TrainerState/getTrainers'),
        this.$store.dispatch('CourseAreaState/getCourseAreas'),
        this.$store.dispatch('TestState/getTests'),
        this.$store.dispatch('CouponState/getCoupons'),
        this.$store.dispatch('OrderState/getOrders'),
        this.$store.dispatch('SupportState/getSupportTickets'),
        this.$store.dispatch('SupportState/getSupportCategories'),
        this.$store.dispatch('UserCourseState/getUsersCourses'),
        this.$store.dispatch('PoliciesState/getCookies'),
        this.$store.dispatch('PoliciesState/getTermsAndConditions'),
        this.$store.dispatch('AppState/updateLogState', true),
        this.$store.dispatch('AppState/updateItemsPerPage', window.screen.width > 1600 ? 10 : 5)
      ])
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

  .loading_app {
    margin-top: 80px;
    margin-left: 16vw;
  }

  .skeleton {
    width: calc(100% / 3 - 10px);
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
