<template>
    <panel :title="$t('registration')">
        <nav-btn
                link="root"
                slot="action"
                icon="mdi-arrow-left-bold"
                :tooltipText="$t('goBack')"
        ></nav-btn>
        <register-form
                :showError.sync="showError"
                :btnLoad.sync="btnLoad"
                :error="error[errorLocale]"
                :btnText="$t('submitRegister')"
                @submit-form="register()">
            <v-text-field
                    v-model="credentials.email"
                    :label="$t('email')"
                    clearable
                    maxlength="256"
                    error-count="3"
                    :rules="[rules.required, rules.emailMatch]"
            ></v-text-field>

            <v-text-field
                    v-model="credentials.password"
                    :rules="[rules.required, rules.min, rules.atLeastOneCapCharAndNum]"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="showPassword ? 'text' : 'password'"
                    :label="$t('password')"
                    error-count="3"
                    @click:append="showPassword = !showPassword"
            ></v-text-field>

            <v-text-field
                    v-model="credentials.firstName"
                    :label="$t('firstName')"
                    clearable
                    maxlength="128"
                    error-count="2"
                    :rules="[rules.required, rules.charMatch]"
            ></v-text-field>

            <v-text-field
                    v-model="credentials.lastName"
                    :label="$t('lastName')"
                    clearable
                    maxlength="128"
                    error-count="2"
                    :rules="[rules.required, rules.charMatch]"
            ></v-text-field>

            <v-alert
                    slot="success-alert"
                    v-model="showSuccess"
                    class="font-weight-bold"
                    dense
                    type="success">
                {{ $t('registrationSuccess') }}
            </v-alert>

        </register-form>
    </panel>
</template>

<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import IRegisterCredentials from '@/domain/IRegisterCredentials';
import ScreenBreakPointsControl from '@/mixins/ScreenBreakPointsControl';
import rules from '@/services/ValidationRules';

const user = namespace('user');

@Component({
    components: {
        'panel': () => import('@/components/Panel.vue'),
        'register-form': () => import('@/components/Form.vue'),
        'nav-btn': () => import('@/components/globals/NavigationButton.vue')
    }
})
export default class Register extends Mixins(ScreenBreakPointsControl) {
    private credentials: IRegisterCredentials = {
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    };

    private showPassword: boolean = false;
    private btnLoad: boolean = false;
    private showError: boolean = false;
    private isSubmitted: boolean = false;
    private showSuccess: boolean = false;
    private error: object = {};

    @user.Action('register')
    private registerUser!: (credentials: IRegisterCredentials) => Promise<any>;

    async register() {
        if (!this.isSubmitted) {
            this.btnLoad = true;
            this.isSubmitted = true;
            this.registerUser(this.credentials)
                .then(() => {
                    this.btnLoad = false;
                    this.showSuccess = true;
                    setTimeout(async() => {
                        await this.$router.push({ name: 'login', params: { locale: this.$i18n.locale } });
                    }, 1000);
                })
                .catch(err => {
                    this.btnLoad = false;
                    this.isSubmitted = false;
                    this.showError = true;
                    this.error = err.response.data;
                });
        }
    }

    private get rules() {
        return rules;
    }

    private get errorLocale(): string {
        return this.$i18n.locale === 'ru' ? 'errorRu' : 'error';
    }
}
</script>

<style scoped>

</style>
