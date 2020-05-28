<template>
    <v-navigation-drawer
            v-model="syncedDrawer"
            absolute
            temporary
    >
        <v-list-item>
            <v-list-item-avatar>
                <v-img :src="require('@/assets/shrek.jpg')"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title>{{ getUser.fullName }}</v-list-item-title>
                <v-list-item-subtitle>{{ getUser.username }}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list>

            <v-list-item
                    v-for="link in links"
                    :key="link.title"
                    link
                    @click="$router.push(link.route)"
            >
                <v-list-item-icon>
                    <v-icon>{{ link.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title class="align-text-left">
                        {{ $t('navDrawer.' + link.title) }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-group prepend-icon="mdi-account-circle">
                <template v-slot:activator>
                    <v-list-item-title class="align-text-left">
                        {{ $t('navDrawer.profile') }}
                    </v-list-item-title>
                </template>

                <v-list-item
                        v-for="link in userLinks"
                        :key="link.title"
                        :to="link.route"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ $t('navDrawer.' + link.title) }}</v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-icon>
                        <v-icon>{{ link.icon }}</v-icon>
                    </v-list-item-icon>
                </v-list-item>

            </v-list-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import {Component, Vue, PropSync} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import IUser from '@/domain/IUser';
import { Trans } from '@/plugins/Translation';

const user = namespace('user');

@Component
export default class NavDrawer extends Vue {
    @user.Getter private readonly getUser!: IUser;
    @PropSync('drawer', { type: Boolean }) private syncedDrawer!: any;

    private links: object[] = [
        {
            title: 'home',
            icon: 'mdi-home',
            route: Trans.i18nRoute({ name: 'root' })
        },
        {
            title: 'reviews',
            icon: 'mdi-star',
            route: Trans.i18nRoute({ name: 'reviews' })
        }
    ];

    private userLinks: object[] = [
        {
            title: 'orders',
            icon: 'mdi-cart-outline',
            route: Trans.i18nRoute({ name: 'user-orders' })
        },
        {
            title: 'delivery',
            icon: 'mdi-truck-delivery',
            route: Trans.i18nRoute({ name: 'user-delivery' })
        }
    ];
}
</script>

<style scoped>
    .align-text-left {
        text-align: left !important;
    }
</style>
