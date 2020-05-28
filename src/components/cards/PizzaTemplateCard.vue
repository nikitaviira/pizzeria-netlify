<template>
    <v-card
            class="mx-auto elevation-6 mb-10"
            height="380"
            :max-width="getTemplateWidth"
    >
        <v-img
                :src="require(`@/assets/${pictureName}`)"
                :lazy-src="require(`@/assets/shit-${pictureName}`)"
                aspect-ratio="1"
                height="200px"
        >
            <template v-slot:placeholder>
                <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                >
                    <v-progress-circular indeterminate color="white lighten-5" />
                </v-row>
            </template>
        </v-img>

        <v-card-title
                :class="{ titleXl: $vuetify.breakpoint.xlOnly }"
                style="display: block;"
        >
            {{ name }}
        </v-card-title>

        <v-card-subtitle :class="{ subtitleXl: $vuetify.breakpoint.xlOnly }">
            {{ description }}
        </v-card-subtitle>

        <v-card-actions style="place-content: center;">
            <v-btn
                    text
                    :large="$vuetify.breakpoint.xlOnly"
                    :class="$vuetify.breakpoint.xlOnly ? 'font-weight-bold' : ''"
                    class="white--text primary template-btns align-center"
                    :to="$i18nRoute({ name: 'create-pizza-template', params: { template: templateName } })"
            >
                {{ $t('templatesBtnText') }}
                <v-icon color="white">mdi-arrow-right-bold</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import {Component, Mixins, Prop} from 'vue-property-decorator';
import ScreenBreakPointsControl from '@/mixins/ScreenBreakPointsControl';

@Component
export default class PizzaTemplateCard extends Mixins(ScreenBreakPointsControl) {
    @Prop(String) private readonly name!: string;
    @Prop(String) private readonly description!: string;
    @Prop(String) private readonly pictureName!: string;
    @Prop(String) private readonly templateName!: string;

    private get getTemplateWidth() {
        if (this.screenWidth < 840) {
            return '90%';
        } else if (this.$vuetify.breakpoint.xlOnly) {
            return 440;
        } else if (this.$vuetify.breakpoint.mdOnly) {
            return 385;
        } else if (this.$vuetify.breakpoint.smOnly) {
            return 385;
        }

        return 345;
    }
}
</script>

<style scoped>
    .template-btns {
        text-transform: none;
        margin-bottom: 10px;
        margin-top: 0px !important;
    }

    .titleXl {
        font-size: 1.45rem;
    }

    .subtitleXl {
        font-size: 1.2rem;
    }
</style>
