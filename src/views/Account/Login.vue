<template>
    <panel :title="$t('login')">
        <nav-btn
                link="root"
                slot="action"
                icon="mdi-arrow-left-bold"
                :tooltipText="$t('goBack')"
        ></nav-btn>
        <login-form
                :showError.sync="showError"
                :btnLoad.sync="btnLoad"
                :btnText="$t('submitLogin')"
                :error="error[errorLocale]"
                @submit-form="login()">
            <v-text-field
                    v-model="credentials.email"
                    :label="$t('email')"
                    clearable
                    error-count="2"
                    :rules="[rules.required, rules.emailMatch]"
            ></v-text-field>
            <v-text-field
                    v-model="credentials.password"
                    :rules="[rules.required]"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="showPassword ? 'text' : 'password'"
                    :label="$t('password')"
                    error-count="1"
                    @click:append="showPassword = !showPassword"
            ></v-text-field>
        </login-form>
    </panel>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import ILoginCredentials from '@/domain/ILoginCredentials';
import rules from '@/services/ValidationRules';

const user = namespace('user');

@Component({
    components: {
        'panel': () => import('@/components/Panel.vue'),
        'login-form': () => import('@/components/Form.vue'),
        'nav-btn': () => import('@/components/globals/NavigationButton.vue')
    }
})
export default class Login extends Vue {

    private credentials: ILoginCredentials = {
        email: '',
        password: ''
    };
    private showPassword: boolean = false;
    private showError: boolean = false;
    private btnLoad: boolean = false;
    private error: object = {};

    @user.Action('login')
    private loginUser!: (credentials: ILoginCredentials) => Promise<any>;

    async login() {
        this.btnLoad = true;

        await this.loginUser(this.credentials)
            .then(async() => {
                await this.$router.push({ name: 'root', params: { locale: this.$i18n.locale } });
            })
            .catch(err => {
                this.btnLoad = false;
                this.showError = true;
                this.error = err.response.data;
            });
    }

    private get errorLocale(): string {
        return this.$i18n.locale === 'ru' ? 'errorRu' : 'error';
    }

    private get rules() {
        return rules;
    }
}
</script>

<style scoped>

</style>
