<template>
    <v-row>
        <v-toolbar-items v-if="!isLoggedIn">
            <router-link :to="$i18nRoute({ name: 'login' })" class="no-underline-link">
                <v-btn text class="white--text mt-3">
                    <v-icon class="mr-2">mdi-login</v-icon>
                    {{ $t('login') }}
                </v-btn>
            </router-link>
        </v-toolbar-items>

        <v-toolbar-items v-if="!isLoggedIn">
            <router-link :to="$i18nRoute({ name: 'register' })" class="no-underline-link">
                <v-btn text class="white--text mt-3">
                    <v-icon class="mr-2">mdi-account-plus</v-icon>
                    {{ $t('registration') }}
                </v-btn>
            </router-link>
        </v-toolbar-items>

        <v-toolbar-items v-if="isLoggedIn">
            <a class="no-underline-link">
                <v-btn text class="white--text mt-3" @click="logout">
                    <v-icon class="mr-2">mdi-logout</v-icon>
                    {{ $t('logOut') }}
                </v-btn>
            </a>
        </v-toolbar-items>
    </v-row>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';

const user = namespace('user');

@Component
export default class UserNavigationLinks extends Vue {
    @user.Getter private readonly isLoggedIn!: boolean;
    @user.Action('logout') private logoutUser!: () => Promise<void>;

    private logout(): void {
        this.logoutUser().then(
            async() => {
                await this.$router.push({ name: 'login', params: { locale: this.$i18n.locale } });
            }
        );
    }
}
</script>

<style scoped>
    .no-underline-link {
        text-decoration: none
    }

    .v-btn:before {
        background-color: transparent;
    }
</style>
