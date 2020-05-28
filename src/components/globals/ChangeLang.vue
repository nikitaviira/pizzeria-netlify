<template>
    <v-row justify="center">
        <v-img
                max-height="30"
                max-width="30"
                :src="require('@/assets/flag-ru.png')"
                eager
                style="cursor: pointer;"
                class="mr-3 ml-3 mt-3"
                @click="changeLocale('ru')"
        >
        </v-img>

        <v-divider
                :inset="inset"
                vertical
                :class="marginTop"
                style="background: white;"
        ></v-divider>

        <v-img
                max-height="30"
                max-width="30"
                style="cursor: pointer;"
                :src="require('@/assets/flag-en.png')"
                eager
                class="mr-3 ml-3 mt-3"
                @click="changeLocale('en')"
        >
        </v-img>
    </v-row>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import { Trans } from '@/plugins/Translation';

@Component
export default class ChangeLang extends Vue {
    @Prop(String) private readonly marginTop!: string;
    @Prop(Boolean) private readonly inset!: boolean;

    private changeLocale(locale: string) {
        if (this.$i18n.locale !== locale) {
            const to = this.$router.resolve({ params: { locale } });

            return Trans.changeLocale(locale).then(() => { this.$router.push(to.location); });
        }
    }
}
</script>

<style scoped>

</style>
