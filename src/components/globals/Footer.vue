<template>
    <v-footer
            padless
            color="primary"
            absolute
    >
        <v-row
                justify="center"
                no-gutters
        >
            <v-row justify="center" v-if="langChangeBreakPoint">
                <change-lang marginTop="mt-3"></change-lang>
            </v-row>

            <v-col
                    class="primary py-4 text-center white--text"
                    cols="12"
            >
                <span>{{ new Date().getFullYear() }} — <strong>{{ $t('footerText') }}</strong></span>
            </v-col>
        </v-row>
    </v-footer>
</template>

<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator';
import ScreenBreakPointsControl from '@/mixins/ScreenBreakPointsControl';

@Component({
    components: {
        'change-lang': () => import('@/components/globals/ChangeLang.vue'),
    }
})
export default class Footer extends Mixins(ScreenBreakPointsControl) {

}
</script>

<style scoped>

</style>

