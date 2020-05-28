<template>
    <v-container>
        <v-row dense>
            <v-col
                    v-for="(ingredient, i) in ingredients"
                    :key="i"
                    cols="12"
            >
                <v-card
                        :color="i % 2 === 0 ? '#2141dc' : '#187716'"
                        dark
                >
                    <div class="d-flex flex-no-wrap justify-space-between">
                        <div>
                            <v-card-title
                                    v-if="dataLoaded"
                                    :class="langChangeBreakPoint ? 'title' : 'headline'"
                                    v-text="titleLocale(i*1)"
                            ></v-card-title>

                            <v-card-subtitle v-if="dataLoaded" class="float-left">
                                {{ $t('price') }}: <b>{{ ingredient.price }}</b> ({{ $t('perGramm') }})
                            </v-card-subtitle>

                            <br>

                            <v-card-actions v-if="dataLoaded">
                                <slot :ingredient="ingredient"></slot>
                            </v-card-actions>
                        </div>

                        <v-avatar
                                v-if="dataLoaded"
                                class="ma-3"
                                :size="langChangeBreakPoint ? 100 : 125"
                        >
                            <v-img :src="ingredient.imageUrl">
                                <template v-slot:placeholder>
                                    <v-row
                                            class="fill-height ma-0"
                                            align="center"
                                            justify="center"
                                    >
                                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                    </v-row>
                                </template>
                            </v-img>
                        </v-avatar>

                        <v-row
                                v-if="!dataLoaded"
                                class="fill-height pa-12"
                                align="center"
                                justify="center"
                        >
                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-row>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import IIngredient from '@/domain/IIngredient';
import PizzaApi from '@/services/api/PizzaAPI';
import ScreenBreakPointsControl from '@/mixins/ScreenBreakPointsControl';

@Component
export default class IngredientCard extends Mixins(ScreenBreakPointsControl) {
    @Prop(String) private readonly ingredientCategory!: string;

    private ingredients: IIngredient[] = [
        {} as IIngredient, {} as IIngredient, {} as IIngredient, {} as IIngredient
    ];
    private dataLoaded: boolean = false;

    private async created(): Promise<void> {
        await PizzaApi.getIngredientsByCategory(this.ingredientCategory)
            .then(resp => {
                this.dataLoaded = true;
                this.ingredients = resp.data;
            });
    }

    private titleLocale(index: number): string {
        const ingredient = this.ingredients[index];

        return this.$i18n.locale === 'ru' ? ingredient.nameRu : ingredient.name;
    }
}
</script>

<style scoped>

</style>
