<template>
    <v-app id="app" class="hide-overflow">
        <app-nav-bar :drawer.sync="drawer"></app-nav-bar>
        <v-content class="main-background">
                <transition
                        @enter="showFooter = true"
                        @before-leave="showFooter = false"
                        enter-active-class="animated fadeInRight fast"
                        leave-active-class="animated fadeOutLeft"
                        name="custom-classes-transition"
                        mode="out-in"
                >
                    <router-view></router-view>
                </transition>
            <app-drawer :drawer.sync="drawer"></app-drawer>
        </v-content>
        <app-footer v-if="showFooter"></app-footer>
    </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    components: {
        'app-nav-bar': () => import('@/components/globals/NavBar.vue'),
        'app-footer': () => import('@/components/globals/Footer.vue'),
        'app-drawer': () => import('@/components/globals/NavDrawer.vue')
    }
  })
  export default class App extends Vue {
      private showFooter: boolean = true;
      private drawer: any = null;
  }
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans&family=Oxygen:wght@700&display=swap');

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .required label::after {
        content: "*";
        color: red;
    }

    .main-background {
        background: rgba(66, 141, 185, 0.34);
    }

    .hide-overflow {
        overflow: hidden;
    }

    .v-toolbar__extension {
        padding-bottom: 10px !important;
    }

    .resize {
        max-height: 360px !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
    }

    .fade-enter-active, .fade-leave-active {
        transition-property: opacity;
        transition-duration: .25s;
    }

    .fade-enter-active {
        transition-delay: .25s;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0;
    }

    .disable-events {
        pointer-events: none;
    }

    .v-data-footer__select {
        display: none !important;
    }

    #nav a.router-link-exact-active {
        color: #42b983;
    }
</style>
