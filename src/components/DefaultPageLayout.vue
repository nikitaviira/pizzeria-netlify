<template>
    <v-container grid-list-xl>
        <v-layout row class="mt-5">
            <v-flex :offset-xs1="$vuetify.breakpoint.xlOnly" xl10>
                <picture-card position="center right" :pictureName="pictureName">
                    <div
                            :class="fontSize"
                            class="font-weight-bold font-italic custom-font"
                    >
                        {{ $t(localeTitle) }}
                    </div>
                    <slot name="subText" />
                </picture-card>
            </v-flex>
        </v-layout>
        <v-layout
                v-bind="binding"
                class="mt-5"
                :class="screenHeight <= 420 ? '' : (!langChangeBreakPoint ? 'margin-b' : 'margin-b-lang-break')"
        >
            <slot name="content" />
        </v-layout>
        <slot name="alerts" />
    </v-container>
</template>

<script lang="ts">
import {Component, Mixins, Prop} from 'vue-property-decorator';
import ScreenBreakPointsControl from '@/mixins/ScreenBreakPointsControl';

@Component({
    components: {
        'picture-card': () => import('@/components/cards/MainPictureCard.vue')
    }
})
export default class DefaultPageLayout extends Mixins(ScreenBreakPointsControl) {
    @Prop(String) private readonly pictureName!: string;
    @Prop(String) private readonly localeTitle!: string;
}
</script>

<style scoped>
    .margin-b {
        margin-bottom: 80px !important;
    }

    .margin-b-lang-break {
        margin-bottom: 120px !important;
    }
</style>
