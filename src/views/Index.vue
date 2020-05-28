<template>
    <page-layout pictureName="pizza-main-2" localeTitle="buildPizzaMsg">
        <template v-slot:subText>
            <div class="display-1 mt-5">
                <v-btn
                        text
                        :large="$vuetify.breakpoint.xlOnly"
                        :class="{ fontWeightBold: $vuetify.breakpoint.xlOnly }"
                        class="white--text primary template-btns align-center mb-5"
                        :to="$i18nRoute({ name: 'create-pizza' })"
                >
                    {{ $t('buildPizzaBtnMsg') }}
                    <v-icon style="margin-left: 10px" color="white">mdi-wrench</v-icon>
                </v-btn>
            </div>
        </template>
        <template v-slot:content>
            <v-flex :offset-xs1="$vuetify.breakpoint.xlOnly" xl10>
                <v-card class="elevation-5">
                    <v-toolbar
                            flat
                            dense
                            class="primary"
                            dark
                    >
                        <v-toolbar-title class="font-weight-bold">
                            {{ $t('templatesTitle') }}
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-carousel
                            light
                            :show-arrows="screenWidth >= 1000"
                            show-arrows-on-hover
                            hide-delimiters
                            cycle
                            height="430"
                    >
                        <div v-if="screenWidth >= 840">
                            <v-carousel-item>
                                <v-layout row class="pa-4 mt-3">
                                    <template-card
                                            :name="$t('pizzaTemplates.margheritaTemplate.name')"
                                            :description="$t('pizzaTemplates.margheritaTemplate.description')"
                                            templateName="margherita"
                                            pictureName="margherita-pizza.jpg"
                                    ></template-card>
                                    <template-card
                                            :name="$t('pizzaTemplates.americanaTemplate.name')"
                                            :description="$t('pizzaTemplates.americanaTemplate.description')"
                                            templateName="americana"
                                            pictureName="americana-pizza.jpg"
                                    ></template-card>
                                    <template-card
                                            v-if="$vuetify.breakpoint.lgAndUp"
                                            :name="$t('pizzaTemplates.romanaTemplate.name')"
                                            :description="$t('pizzaTemplates.romanaTemplate.description')"
                                            templateName="romana"
                                            pictureName="romana-pizza.jpg"
                                    ></template-card>
                                </v-layout>
                            </v-carousel-item>
                            <v-carousel-item>
                                <v-layout row class="pa-4 mt-3">
                                    <template-card
                                            :name="$t('pizzaTemplates.hawaiianTemplate.name')"
                                            :description="$t('pizzaTemplates.hawaiianTemplate.description')"
                                            templateName="hawaiian"
                                            pictureName="hawaiian-pizza.jpg"
                                    ></template-card>
                                    <template-card
                                            :name="$t('pizzaTemplates.spicyChickenTemplate.name')"
                                            :description="$t('pizzaTemplates.spicyChickenTemplate.description')"
                                            templateName="spicyChicken"
                                            pictureName="spicyChicken-pizza.jpg"
                                    ></template-card>
                                    <template-card
                                            v-if="$vuetify.breakpoint.lgAndUp"
                                            :name="$t('pizzaTemplates.mushroomsOnionTemplate.name')"
                                            :description="$t('pizzaTemplates.mushroomsOnionTemplate.description')"
                                            templateName="mushroomsOnion"
                                            pictureName="mushroomsOnion-pizza.jpg"
                                    ></template-card>
                                </v-layout>
                            </v-carousel-item>
                            <v-carousel-item v-if="$vuetify.breakpoint.mdAndDown">
                                <v-layout row class="pa-4 mt-3">
                                    <template-card
                                            :name="$t('pizzaTemplates.romanaTemplate.name')"
                                            :description="$t('pizzaTemplates.romanaTemplate.description')"
                                            templateName="romana"
                                            pictureName="romana-pizza.jpg"
                                    ></template-card>
                                    <template-card
                                            :name="$t('pizzaTemplates.mushroomsOnionTemplate.name')"
                                            :description="$t('pizzaTemplates.mushroomsOnionTemplate.description')"
                                            templateName="mushroomsOnion"
                                            pictureName="mushroomsOnion-pizza.jpg"
                                    ></template-card>
                                </v-layout>
                            </v-carousel-item>
                        </div>
                        <div v-else>
                            <v-carousel-item v-for="template in templateNames">
                                <v-layout row class="pa-4 mt-3">
                                    <template-card
                                            :name="$t(`pizzaTemplates.${template}Template.name`)"
                                            :description="$t(`pizzaTemplates.${template}Template.description`)"
                                            :templateName="template"
                                            :pictureName="template + '-pizza.jpg'"
                                    ></template-card>
                                </v-layout>
                            </v-carousel-item>
                        </div>
                    </v-carousel>
                </v-card>
            </v-flex>
        </template>
    </page-layout>
</template>

<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator';
import ScreenBreakPointsControl from '@/mixins/ScreenBreakPointsControl';

@Component({
    components: {
        'template-card': () => import('@/components/cards/PizzaTemplateCard.vue'),
        'page-layout': () => import('@/components/DefaultPageLayout.vue')
    }
})
export default class MainPage extends Mixins(ScreenBreakPointsControl) {
    private templateNames: string[] = [
        'margherita',
        'americana',
        'romana',
        'hawaiian',
        'spicyChicken',
        'mushroomsOnion'
    ];

    private beforeCreate(): void {
        window.scrollTo(0, 0);
    }
}
</script>

<style scoped>
    .custom-font {
        font-family: 'Open Sans', sans-serif;
        font-family: 'Oxygen', sans-serif;
    }

    .margin-b {
        margin-bottom: 80px !important;
    }

    .margin-b-breakpoint {
        margin-bottom: 130px !important;
    }
</style>
