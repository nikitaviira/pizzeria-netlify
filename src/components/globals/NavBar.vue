<template>
    <v-app-bar
            app
            clipped-left
            absolute
            class="primary white--text"
    >
        <router-link
                style="margin-left: 0"
                :to="$i18nRoute({ name: 'root' })"
        >
            <v-toolbar-title>
                <v-btn
                        text
                        class="white--text font-weight-bold"
                >
                    {{ $t('brand') }}
                    <v-icon class="ml-2">mdi-pizza</v-icon>
                </v-btn>
            </v-toolbar-title>
        </router-link>

        <a v-if="!langChangeBreakPoint && isLoggedIn">
            <v-toolbar-title>
                <v-btn
                        icon
                        @click.stop="syncedDrawer = !syncedDrawer"
                        class="white--text font-weight-bold"
                >
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
            </v-toolbar-title>
        </a>

        <v-spacer></v-spacer>

        <div style="margin-bottom: 8px; margin-right: 5px;">
            <change-lang
                    v-if="!navbarBreakPoint"
                    :inset="true"
            ></change-lang>
        </div>

        <div
                class="text-center"
                :class="navbarBreakPoint ? 'mr-4 mt-2' : ''"
        >
            <shopping-cart></shopping-cart>
        </div>

        <div
                v-if="!navbarBreakPoint"
                style="margin-bottom: 8px; margin-left: 15px; margin-right: 10px"
        >
            <user-navigation></user-navigation>
        </div>

        <template
                v-if="navbarBreakPoint"
                v-slot:extension
        >
            <div style="margin-left: 10px;">
                <user-navigation></user-navigation>
            </div>

            <a v-if="langChangeBreakPoint && isLoggedIn" class="ml-2">
                <v-toolbar-title>
                    <v-btn
                            text
                            @click.stop="syncedDrawer = !syncedDrawer"
                            class="white--text mt-3"
                    >
                        <v-icon class="mr-2">mdi-menu</v-icon>
                        {{ $t('menu') }}
                    </v-btn>
                </v-toolbar-title>
            </a>

            <v-spacer></v-spacer>

            <div style="margin-bottom: 8px; margin-right: 5px;">
                <change-lang
                        v-if="!langChangeBreakPoint"
                        marginTop="mt-2"
                ></change-lang>
            </div>
        </template>
    </v-app-bar>
</template>

<script lang="ts">
import {Component, Mixins, PropSync} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import ScreenBreakPointsControl from '@/mixins/ScreenBreakPointsControl';

const user = namespace('user');

@Component({
    components: {
        'change-lang': () => import('@/components/globals/ChangeLang.vue'),
        'user-navigation': () => import('@/components/globals/AccountLinks.vue'),
        'shopping-cart': () => import('@/components/globals/ShoppingCart.vue')
    }
})
export default class NavBar extends Mixins(ScreenBreakPointsControl) {
    @user.Getter private readonly isLoggedIn!: boolean;
    @PropSync('drawer', { type: Boolean }) private syncedDrawer!: any;
}
</script>

<style scoped>
    .v-btn:before {
        background-color: transparent;
    }
</style>
