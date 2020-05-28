<template>
    <v-container
            fluid
            :class="langChangeBreakPoint ? 'margin-b-lang-break' : 'margin-b'"
    >
        <v-row>
            <v-flex
                    xs10 sm8 md8 lg6 xl6
                    :offset-xs3="$vuetify.breakpoint.lgOnly || $vuetify.breakpoint.xlOnly"
                    :offset-xs2="$vuetify.breakpoint.mdOnly || $vuetify.breakpoint.smOnly"
                    :offset-xs1="$vuetify.breakpoint.xsOnly"
            >
                <v-card class="elevation-10" :class="$vuetify.breakpoint.xsOnly ? 'mt-5' : 'mt-10'">
                    <v-toolbar flat dense class="primary" dark>
                        <v-toolbar-title class="font-italic font-weight-bold">{{ title }}</v-toolbar-title>
                        <slot name="action"></slot>
                    </v-toolbar>

                    <div class="pa-4">
                        <slot>Nothing here!</slot>
                    </div>
                </v-card>
            </v-flex>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import ScreenBreakPointsControl from '@/mixins/ScreenBreakPointsControl';

@Component
export default class Panel extends Mixins(ScreenBreakPointsControl) {
    @Prop(String) private readonly title!: string;
}
</script>

<style scoped>
    .margin-b {
        margin-bottom: 90px !important;
    }

    .margin-b-lang-break {
        margin-bottom: 130px !important;
    }
</style>
